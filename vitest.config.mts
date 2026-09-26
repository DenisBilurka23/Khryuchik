import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/app/api/checkout/utils.ts",
        "src/constants/bpost.ts",
        "src/server/shipping/bpost-tariff.ts",
        "src/server/shipping/packing.ts",
        "src/server/shipping/providers/bpost.provider.ts",
        "src/server/shipping/utils.ts",
        "src/utils/order.ts",
        "src/utils/postal-code.ts",
        "src/utils/price-conversion.ts",
        "src/utils/promo.ts",
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
