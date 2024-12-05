import { ReadonlyURLSearchParams } from "next/navigation";

export type PathnameValue =
  | string
  | (({
      pathname,
      searchParams,
    }: {
      pathname: string;
      searchParams: ReadonlyURLSearchParams | null;
    }) => string);

const pathnames: {
  [key: string]: PathnameValue | typeof pathnames;
} = {
  "/": "Magick.ly",
  about: "About",
  admin: "Admin",
  chat: "MagickGPT",
  enochian: {
    "/": "Enochian",
    dictionary: "Dictionary",
    keys: "Keys",
    oration: "Oration",
    tablets: "Tablets",
  },
  gd: {
    "/": "Golden Dawn",
  },
  geomancy: {
    "/": "Geomancy",
    reading: "Reading",
    reference: "Reference",
  },
  temples: {
    "/": "Temples",
    admin: "Admin",
  },
};

export default pathnames;
