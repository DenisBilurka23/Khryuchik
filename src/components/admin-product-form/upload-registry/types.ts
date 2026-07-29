export type AdminProductUploadRunner = () => Promise<void>;

export type AdminProductUploadRegistryValue = {
  register: (runner: AdminProductUploadRunner) => () => void;
  runAll: () => Promise<void>;
};
