import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { MongoClient } from "mongodb";

import { REGION_CODES } from "@/constants/region";
import { defaultLocale, locales } from "@/i18n/config";
import type {
  CategoryDocument,
  JetprintBlank,
  ProductDetailDocument,
  ProductDocument,
} from "@/types/catalog";
import type { RegionCode } from "@/types/localization";
import type { ProductImage, ProductOption } from "@/types/product-details";
import {
  buildUniqueValue,
  createEmptyAdminProductPayload,
  normalizeIdentifierPart,
  normalizeSkuPart,
} from "@/utils/admin";
import {
  buildJetprintProductOptions,
  buildJetprintVariantLinks,
} from "@/utils/jetprint";

import {
  readJetprintBlankResponse,
  saveJetprintBlank,
} from "./jetprint-blank-catalog-file";
import type { RawJetprintBlank } from "./jetprint-blank-parse";
import {
  fitTemplateToPrintArea,
  getArtEffectiveDpi,
  readPrintTemplate,
  type RenderableArtLayer,
  renderPrintFile,
  renderPrintPreview,
} from "./jetprint-print-render";
import {
  applyJetprintPriceDeltas,
  type JetprintMyProduct,
  parsePrintAreaSize,
  type RawJetprintMyProduct,
  toJetprintArtLayers,
  toJetprintMyProduct,
} from "./jetprint-product-parse";

type ContentTranslation = {
  title: string;
  subtitle: string;
  description: string;
};

type ProductContent = {
  category: string;
  emoji: string;
  regions: RegionCode[];
  prices: Record<string, number>;
  translations: Record<string, ContentTranslation>;
};

type ProductOptions = {
  sizes: ProductOption[];
  colors: ProductOption[];
};

type ImportResult = {
  productId: string;
  slug: string;
  sku: string;
  adminPath: string;
  importedAt: string;
};

const FILES = {
  myProduct: "my-product.json",
  blank: "product-info.json",
  content: "content.json",
  result: "import-result.json",
  template: join("template", "design-template.psd"),
  printFile: join("print", "print-file.png"),
  preview: join("print", "preview-with-guides.jpg"),
} as const;

const DEFAULT_CATEGORY = "gifts";
const DEFAULT_EMOJI = "🎁";
const PRICE_CURRENCIES = ["USD", "EUR"] as const;
const MIN_PRINT_DPI = 150;

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const readJson = <T>(path: string): T => {
  const parsed = JSON.parse(readFileSync(path, "utf8"));

  return parsed.data ?? parsed;
};

const writeJson = (path: string, value: unknown) =>
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

const sanitizeFileName = (fileName: string) =>
  fileName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const toSafeLocalName = (name: string) =>
  name.replace(/[<>:"/\\|?*]+/g, "_").trim() || "file";

const download = async (url: string, target: string) => {
  if (existsSync(target)) {
    return readFileSync(target);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());

  mkdirSync(resolve(target, ".."), { recursive: true });
  writeFileSync(target, bytes);

  return bytes;
};

const getMockupPaths = (folder: string, product: JetprintMyProduct) =>
  product.imageUrls.map((url, index) =>
    join(
      folder,
      "mockups",
      `${String(index + 1).padStart(2, "0")}-${basename(new URL(url).pathname)}`,
    ),
  );

const pickBlankSkus = (raw: RawJetprintBlank, product: JetprintMyProduct) => {
  const skuById = new Map(raw.skuInfos.map((sku) => [sku.id, sku.skuName]));

  const priceBySku = new Map<string, number>();
  const skus = product.variants.map(({ blankSkuId, price }) => {
    const sku = skuById.get(blankSkuId);

    if (!sku) {
      throw new Error(
        `Variant ${blankSkuId} of the product is missing from blank ${raw.id}`,
      );
    }

    priceBySku.set(sku, price);

    return sku;
  });

  return { skus, priceBySku };
};

const createDraftContent = (product: JetprintMyProduct): ProductContent => ({
  category: DEFAULT_CATEGORY,
  emoji: DEFAULT_EMOJI,
  regions: [...REGION_CODES],
  prices: Object.fromEntries(
    PRICE_CURRENCIES.map((currency) => [currency, product.price]),
  ),
  translations: Object.fromEntries(
    [
      defaultLocale,
      ...locales.filter((locale) => locale !== defaultLocale),
    ].map((locale) => [
      locale,
      locale === defaultLocale
        ? {
            title: product.title,
            subtitle: "",
            description: product.description,
          }
        : { title: "", subtitle: "", description: "" },
    ]),
  ),
});

const findContentProblems = (content: ProductContent) => {
  const problems: string[] = [];

  if (!content.translations[defaultLocale]) {
    problems.push(`translations.${defaultLocale} is required`);
  }

  for (const [locale, translation] of Object.entries(content.translations)) {
    for (const field of ["title", "subtitle", "description"] as const) {
      if (!translation[field]?.trim()) {
        problems.push(`translations.${locale}.${field} is empty`);
      }
    }
  }

  if (!Object.values(content.prices).some((price) => price > 0)) {
    problems.push("prices has no positive price");
  }

  const unknownRegions = content.regions.filter(
    (region) => !REGION_CODES.includes(region),
  );

  if (content.regions.length === 0 || unknownRegions.length > 0) {
    problems.push(`regions must be some of: ${REGION_CODES.join(", ")}`);
  }

  return problems;
};

const prepareAssets = async (
  folder: string,
  product: JetprintMyProduct,
  rawProduct: RawJetprintMyProduct,
  rawBlank: RawJetprintBlank,
) => {
  const mockupPaths = getMockupPaths(folder, product);

  await Promise.all(
    product.imageUrls.map((url, index) => download(url, mockupPaths[index])),
  );

  const { designTemplateUrl, printAreaSize } = rawBlank.blankProductInfo;

  if (!designTemplateUrl) {
    throw new Error(`Blank ${rawBlank.id} has no design template`);
  }

  await download(designTemplateUrl, join(folder, FILES.template));

  const psdTemplate = readPrintTemplate(join(folder, FILES.template));
  const printArea = parsePrintAreaSize(printAreaSize);
  const template = printArea
    ? fitTemplateToPrintArea(psdTemplate, printArea)
    : psdTemplate;
  const artLayers = toJetprintArtLayers(rawProduct.designDataJson, template);
  const layers: RenderableArtLayer[] = await Promise.all(
    artLayers.map(async (layer, index) => ({
      ...layer,
      source: await download(
        layer.url,
        join(
          folder,
          "artwork",
          `${artLayers.length > 1 ? `${index + 1}-` : ""}${toSafeLocalName(layer.fileName)}${extname(new URL(layer.url).pathname) || ".png"}`,
        ),
      ),
    })),
  );

  const printFile = await renderPrintFile(template, layers);

  mkdirSync(join(folder, "print"), { recursive: true });
  writeFileSync(join(folder, FILES.printFile), printFile);
  writeFileSync(
    join(folder, FILES.preview),
    await renderPrintPreview(template, printFile),
  );

  const dpis = await Promise.all(
    layers.map((layer) => getArtEffectiveDpi(template, layer)),
  );

  return { mockupPaths, template, dpis };
};

const getEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
};

const createUploader = () => {
  const client = new S3Client({
    region: "auto",
    endpoint: getEnv("R2_S3_API_URL"),
    credentials: {
      accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
  const bucket = getEnv("R2_BUCKET_PUBLIC");
  const publicBaseUrl = getEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, "");
  const uploadedKeys: string[] = [];

  return {
    upload: async (objectKey: string, filePath: string) => {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: objectKey,
          Body: readFileSync(filePath),
          ContentType:
            CONTENT_TYPE_BY_EXTENSION[extname(filePath).toLowerCase()],
        }),
      );
      uploadedKeys.push(objectKey);

      return `${publicBaseUrl}/${objectKey}`;
    },
    rollback: () =>
      Promise.allSettled(
        uploadedKeys.map((objectKey) =>
          client.send(
            new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }),
          ),
        ),
      ),
  };
};

const buildDocuments = ({
  productId,
  sku,
  content,
  blankId,
  blank,
  blankSkus,
  options,
  images,
  printFile,
}: {
  productId: string;
  sku: string;
  content: ProductContent;
  blankId: string;
  blank: JetprintBlank;
  blankSkus: string[];
  options: ProductOptions;
  images: ProductImage[];
  printFile: { name: string; url: string; objectKey: string };
}) => {
  const localeCodes = Object.keys(content.translations);
  const base = createEmptyAdminProductPayload(localeCodes);
  const pricing = Object.fromEntries(
    Object.entries(content.prices)
      .filter(([, price]) => price > 0)
      .map(([currency, price]) => [currency, { price }]),
  );
  const currency = Object.keys(pricing)[0];

  const product: ProductDocument = {
    ...base.product,
    productId,
    slug: productId,
    classification: { type: "merch", category: content.category },
    status: { ...base.product.status, isActive: false },
    pricing,
    availableRegions: content.regions,
    hasOptions: options.sizes.length > 0 || options.colors.length > 0,
    jetprint: {
      blankId,
      variants: buildJetprintVariantLinks(blank, blankSkus),
      printFiles: [printFile],
      previewFiles: [{ name: "preview", url: images[0].src ?? "" }],
    },
    translations: Object.fromEntries(
      localeCodes.map((locale) => [
        locale,
        {
          ...base.product.translations[locale],
          title: content.translations[locale].title.trim(),
          subtitle: content.translations[locale].subtitle.trim(),
          currency,
          emoji: content.emoji,
          thumbnail: images[0],
        },
      ]),
    ),
  };

  const details: ProductDetailDocument = {
    productId,
    sku,
    relatedProductIds: [],
    translations: Object.fromEntries(
      localeCodes.map((locale) => [
        locale,
        {
          ...base.details.translations[locale],
          storyLabel: undefined,
          description: content.translations[locale].description.trim(),
          images: images.map((image) => ({ ...image, id: randomUUID() })),
          sizes: options.sizes,
          colors: options.colors,
        },
      ]),
    ),
  };

  return { product, details };
};

const createProduct = async ({
  folder,
  product,
  content,
  blankId,
  blank,
  blankSkus,
  options,
  mockupPaths,
}: {
  folder: string;
  product: JetprintMyProduct;
  content: ProductContent;
  blankId: string;
  blank: JetprintBlank;
  blankSkus: string[];
  options: ProductOptions;
  mockupPaths: string[];
}): Promise<ImportResult> => {
  const client = new MongoClient(getEnv("MONGODB_URI"));

  await client.connect();

  try {
    const db = client.db(getEnv("MONGODB_DB"));
    const products = db.collection<ProductDocument>("products");
    const detailsCollection =
      db.collection<ProductDetailDocument>("productDetails");
    const productId =
      normalizeIdentifierPart(content.translations[defaultLocale].title) ||
      "product";

    if (await products.findOne({ $or: [{ productId }, { slug: productId }] })) {
      throw new Error(
        `A product "${productId}" already exists; edit it in the admin instead`,
      );
    }

    const category = await db
      .collection<CategoryDocument>("categories")
      .findOne({ key: content.category });

    if (!category || content.category === "books") {
      throw new Error(`Unknown merch category "${content.category}"`);
    }

    const takenSkus = new Set(
      (await detailsCollection.find({}, { projection: { sku: 1 } }).toArray())
        .map((details) => details.sku.trim().toUpperCase())
        .filter(Boolean),
    );
    const sku = buildUniqueValue(
      normalizeSkuPart(productId) || "SKU",
      (candidate) => takenSkus.has(candidate),
    );

    const uploader = createUploader();

    try {
      const images: ProductImage[] = [];

      for (const path of mockupPaths) {
        const objectKey = `products/${productId}/${defaultLocale}/gallery/${randomUUID()}-${sanitizeFileName(basename(path))}`;

        images.push({
          id: randomUUID(),
          src: await uploader.upload(objectKey, path),
          objectKey,
          alt: product.title,
        });
      }

      const printObjectKey = `products/${productId}/jetprint/${randomUUID()}-print-file.png`;
      const printFile = {
        name: "print-file.png",
        url: await uploader.upload(
          printObjectKey,
          join(folder, FILES.printFile),
        ),
        objectKey: printObjectKey,
      };

      const documents = buildDocuments({
        productId,
        sku,
        content,
        blankId,
        blank,
        blankSkus,
        options,
        images,
        printFile,
      });

      await products.insertOne(documents.product);

      try {
        await detailsCollection.insertOne(documents.details);
      } catch (error) {
        await products.deleteOne({ productId });
        throw error;
      }
    } catch (error) {
      await uploader.rollback();
      throw error;
    }

    return {
      productId,
      slug: productId,
      sku,
      adminPath: `/admin/products/${productId}/edit`,
      importedAt: new Date().toISOString(),
    };
  } finally {
    await client.close();
  }
};

const main = async () => {
  const args = process.argv.slice(2);
  const isApplying = args.includes("--apply");
  const folderArg = args.find((arg) => !arg.startsWith("--"));

  if (!folderArg) {
    throw new Error(
      `Usage: npm run jetprint:product -- <product folder with ${FILES.myProduct} and ${FILES.blank}> [--apply]`,
    );
  }

  const folder = resolve(folderArg);
  const resultPath = join(folder, FILES.result);

  if (existsSync(resultPath)) {
    const result = readJson<ImportResult>(resultPath);

    console.log(
      `Already imported as ${result.productId} on ${result.importedAt}: ${result.adminPath}`,
    );

    return;
  }

  const rawProduct = readJson<RawJetprintMyProduct>(
    join(folder, FILES.myProduct),
  );
  const rawBlank = readJetprintBlankResponse(join(folder, FILES.blank));
  const product = toJetprintMyProduct(rawProduct);

  if (product.blankId !== String(rawBlank.id)) {
    throw new Error(
      `${FILES.myProduct} is built on blank ${product.blankId}, but ${FILES.blank} describes blank ${rawBlank.id}`,
    );
  }

  const { blank, isChanged } = await saveJetprintBlank(rawBlank);
  const { skus: blankSkus, priceBySku } = pickBlankSkus(rawBlank, product);
  const { mockupPaths, template, dpis } = await prepareAssets(
    folder,
    product,
    rawProduct,
    rawBlank,
  );

  console.log(`Product   ${product.title}`);
  console.log(
    `Blank     ${blank.name} (${isChanged ? "imported into" : "already in"} src/data/jetprint-blanks.json)`,
  );
  console.log(`SKUs      ${blankSkus.join(", ")}`);
  console.log(`Mockups   ${mockupPaths.length}`);
  console.log(
    `Print     ${template.width}x${template.height} @ ${template.dpi} dpi, artwork ${dpis.join(", ")} dpi -> ${join(folder, FILES.printFile)}`,
  );

  if (dpis.some((dpi) => dpi < MIN_PRINT_DPI)) {
    console.warn(`Warning: artwork is below ${MIN_PRINT_DPI} dpi`);
  }

  const contentPath = join(folder, FILES.content);

  if (!existsSync(contentPath)) {
    writeJson(contentPath, createDraftContent(product));
    console.log(
      `\nWrote ${contentPath}. Fill in the empty texts and run again.`,
    );

    return;
  }

  const content = readJson<ProductContent>(contentPath);
  const problems = findContentProblems(content);

  if (problems.length > 0) {
    console.log(`\n${FILES.content} is not ready:`);
    problems.forEach((problem) => console.log(`  - ${problem}`));

    return;
  }

  console.log(
    `Prices    ${Object.entries(content.prices)
      .map(([currency, price]) => `${price} ${currency}`)
      .join(", ")}`,
  );
  console.log(
    `Content   ${Object.keys(content.translations).join(", ")}, category ${content.category}, regions ${content.regions.join(", ")}`,
  );

  const { options, isPricedPerOption } = applyJetprintPriceDeltas({
    options: buildJetprintProductOptions(blank, blankSkus),
    variants: blank.variants,
    priceBySku,
    basePrice: product.price,
    currencies: Object.keys(content.prices),
  });
  const surcharges = [...options.sizes, ...options.colors].flatMap((option) =>
    option.priceDelta
      ? [`${option.label} +${Object.values(option.priceDelta)[0]}`]
      : [],
  );

  if (surcharges.length > 0) {
    console.log(`Surcharge ${surcharges.join(", ")}`);
  }

  if (!isPricedPerOption) {
    console.warn(
      `Warning: variant prices differ in JetPrint along both size and color; every variant is sold at ${product.price}. Set surcharges in the admin.`,
    );
  }

  if (!isApplying) {
    console.log(
      "\nDry run. Run again with --apply to create the product (hidden).",
    );

    return;
  }

  const result = await createProduct({
    folder,
    product,
    content,
    blankId: String(rawBlank.id),
    blank,
    blankSkus,
    options,
    mockupPaths,
  });

  writeJson(resultPath, result);
  console.log(
    `\nCreated hidden product ${result.productId} (SKU ${result.sku}): ${result.adminPath}`,
  );
};

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
