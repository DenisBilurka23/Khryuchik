import { handleFileRequest } from "./handler";
import type { FilesWorkerEnv } from "./types";

const filesWorker = {
  fetch: (request: Request, env: FilesWorkerEnv) =>
    handleFileRequest(request, env),
};

export default filesWorker;
