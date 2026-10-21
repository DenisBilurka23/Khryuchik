export type FilesR2Range = {
  offset?: number;
  length?: number;
  suffix?: number;
};

export type FilesR2Object = {
  size: number;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
  range?: FilesR2Range;
};

export type FilesR2ObjectBody = FilesR2Object & {
  body: ReadableStream;
};

export type FilesR2Bucket = {
  get(
    key: string,
    options?: { range?: Headers },
  ): Promise<FilesR2ObjectBody | null>;
  head(key: string): Promise<FilesR2Object | null>;
};

export type FilesWorkerEnv = {
  PUBLIC_FILES: FilesR2Bucket;
  PRIVATE_FILES: FilesR2Bucket;
  FILES_SIGNING_SECRET: string;
};
