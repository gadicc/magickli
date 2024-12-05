import React from "react";
import { Button } from "@mui/material";
import EnochianFont from "../../src/enochian/enochianFont";

function EnochianFontToggleBase({
  enochianFont,
  setEnochianFont,
}: {
  enochianFont: boolean;
  setEnochianFont: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Button onClick={() => setEnochianFont(!enochianFont)}>
      <span style={enochianFont ? {} : { color: "red" }}>A</span>
      &nbsp;
      <span
        style={{
          color: enochianFont ? "red" : undefined,
          ...EnochianFont.style,
        }}
      >
        A
      </span>
    </Button>
  );
}

export default function useEnochianFont() {
  const [enochianFont, setEnochianFont] = React.useState<boolean>(false);

  const EnochianFontToggle = () =>
    React.createElement(EnochianFontToggleBase, {
      enochianFont,
      setEnochianFont,
    });

  return { enochianFont, EnochianFontToggle };
}

export { EnochianFont };
