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

const _enochianFont = {
  ...enochianFont,
  style: {
    ...enochianFont.style,
    fontFamily:
      enochianFont.style.fontFamily + ", 'Enochian Plain', 'Enochian'",
    direction: "rtl" as const,
    unicodeBidi: "bidi-override" as const,
  },
};

// console.log("enochianFont", _enochianFont.style);
export default _enochianFont;
