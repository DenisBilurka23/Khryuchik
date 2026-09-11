export type R2DirectUploadOptions = {
  uploadUrl: string;
  file: File;
  contentType: string;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
};

export const uploadDirectToR2 = ({
  uploadUrl,
  file,
  contentType,
  onProgress,
  signal,
}: R2DirectUploadOptions): Promise<void> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const abort = () => {
      xhr.abort();
    };

    if (signal) {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      signal.addEventListener("abort", abort, { once: true });
    }

    xhr.open("PUT", uploadUrl, true);

    if (contentType) {
      xhr.setRequestHeader("Content-Type", contentType);
    }

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) {
          return;
        }

        onProgress(event.total > 0 ? event.loaded / event.total : 0);
      };
    }

    xhr.onload = () => {
      signal?.removeEventListener("abort", abort);

      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(1);
        resolve();
        return;
      }

      reject(new Error(`R2 upload failed with status ${xhr.status}`));
    };

    xhr.onerror = () => {
      signal?.removeEventListener("abort", abort);
      reject(new Error("R2 upload network error"));
    };

    xhr.onabort = () => {
      signal?.removeEventListener("abort", abort);
      reject(new DOMException("Aborted", "AbortError"));
    };

    xhr.send(file);
  });
