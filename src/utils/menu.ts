import type { KeyboardEvent } from "react";

export const scrollMenuToKeyChar = (e: KeyboardEvent<HTMLUListElement>) => {
  if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;

  const key = e.key.toLowerCase();
  const items = Array.from(
    e.currentTarget.querySelectorAll<HTMLElement>('[role="option"]'),
  );
  const match = items.find((el) =>
    el.textContent?.trim().toLowerCase().startsWith(key),
  );

  match?.scrollIntoView({ block: "nearest" });
};
