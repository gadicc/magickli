import { ReadonlyURLSearchParams } from "next/navigation";

const pathnames: {
  [key: string]:
    | string
    | (({
        pathname,
        searchParams,
      }: {
        pathname: string;
        searchParams: ReadonlyURLSearchParams | null;
      }) => string);
} = {
  "/": "Magick.ly",
  "/admin": "Admin",
  "/temples": "Temples",
};

export default pathnames;
