module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-var-requires": "off",
    "react/no-unknown-property": [
      2,
      {
        ignore: ["jsx"],
      },
    ],
  },
  settings: { "import/core-modules": ["styled-jsx/css"] },
};
