import localFont from "next/font/local";

// import "./font/enochian-webfont.woff";
// import "./font/enochian-webfont.woff2";
// import "./enochianFont.css";

const enochianFont = localFont({
  src: [
    {
      path: "./font/enochian-webfont.woff",
    },
    {
      path: "./font/enochian-webfont.woff2",
    },
  ],
  // display: "swap",
});

// @ts-expect-error: todo
enochianFont.style.direction = "rtl";
// @ts-expect-error: todo
enochianFont.style.unicodeBidi = "bidi-override";

enochianFont.style.fontFamily += ", 'Enochian Plain', 'Enochian'";
console.log({ enochianFont });

export default enochianFont;
