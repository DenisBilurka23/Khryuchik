import { locales } from "@/i18n/config";

const normalizePath = (path: string): string => path.replace(/\/+$/, "") || "/";

const isSiteRoot = (path: string): boolean =>
  path === "/" || locales.some((locale) => path === `/${locale}`);

export const isNavItemActive = (pathname: string, href: string): boolean => {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (isSiteRoot(target)) {
    return current === target;
  }

  return current === target || current.startsWith(`${target}/`);
};
