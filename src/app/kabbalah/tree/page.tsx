import React, { Suspense } from "react";
import TreeOfLife from "./tree";

export const metadata = {
  title: "Kabbalistic Tree of Life",
  openGraph: {
    title: "Kabbalistic Tree of Life",
    siteName: "magick.ly",
    description: "Customizable, interactive Tree of Life image and info.",
    type: "website",
    images: [
      {
        url: "https://magick.ly/feature/kabbalah/tree.webp?v=2",
        width: 1200,
        height: 630,
        alt: "Tree of Life svg",
      },
    ],
  },
};

export default function TreeOfLifePage() {
  return (
    <Suspense>
      <TreeOfLife />
    </Suspense>
  );
}
