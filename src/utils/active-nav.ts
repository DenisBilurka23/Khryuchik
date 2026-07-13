const normalizePath = (path: string): string => path.replace(/\/+$/, "") || "/";

export const isNavItemActive = (pathname: string, href: string): boolean => {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  return current === target || current.startsWith(`${target}/`);
};
