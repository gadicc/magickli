import React, { useState } from "react";
import beautify from "xml-beautifier";
import { useRouter } from "next/router";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Link from "../../src/Link";
import Copyright from "../../src/Copyright";

import AppBar from "../../components/AppBar";
import Data from "../../data/data";
import Tree from "../../components/kabbalah/TreeOfLife";

/*
  The mere existance of this function changes the behaviour of how the page
  is served.  Next.js will render the page on-demand, per-request.  The
  important consequence of this is that router.query won't be empty on the
  server.  Edit: However, it prevents page cache on client / slower loading.

  See https://nextjs.org/docs/advanced-features/automatic-static-optimization
*/
/*
function getServerSideProps(context) {
  return { props: {} };
}
*/

function getSvgText() {
  return document.getElementById("TreeOfLife").outerHTML.replace(
    // since React doesn't support namespace tags
    'xmlns="http://www.w3.org/2000/svg"',
    'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
  );
}

function encodeSVG() {
  const svgText = getSvgText();
  const pretty = beautify(svgText);
  const data = encodeURIComponent(pretty);

  const download = document.getElementById("downloadSVG");
  download.setAttribute("download", "TreeOfLife-magickli-export.svg");
  download.setAttribute("href-lang", "image/svg+xml");
  download.setAttribute("href", "data:image/svg+xml;charset=utf-8," + data);
}

async function copySVG(event) {
  event.preventDefault();

  const svgText = getSvgText();
  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const item = new ClipboardItem({ "image/svg+xml": blob });

  try {
    await navigator.clipboard.write([item]);
  } catch (err) {
    if (
      err.message === "Type image/svg+xml not supported on write." ||
      err.message.match(/is not defined/)
    ) {
      // Fallback (and actually only way possible at time of writing)
      const textarea = document.createElement("textarea");
      textarea.value = svgText;
      document.body.appendChild(textarea);
      textarea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (result === "unsuccessful") {
      }
    } else {
      throw err;
    }
  }

  toast("✅ Copied to clipboard as SVG");
}

async function copyPNG(event) {
  event.preventDefault();

  const svgText = getSvgText();
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });

  const svgImage = new Image();
  const svgUrl = URL.createObjectURL(svgBlob);
  await new Promise((resolve) => {
    svgImage.onload = resolve;
    svgImage.src = svgUrl;
  });
  URL.revokeObjectURL(svgUrl);

  const canvas = document.createElement("canvas");
  canvas.height = 1080;
  canvas.width = svgImage.width * (1080 / svgImage.height);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(svgImage, 0, 0);

  const pngBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", 0.9)
  );

  const item = new ClipboardItem({ "image/png": pngBlob });
  await navigator.clipboard.write([item]);
  toast("✅ PNG copied to clipboard");
}

function TreeOfLife() {
  const navParts = [{ title: "Kabbalah", url: "/kabbalah" }];
  const router = useRouter();

  const opts = {};
  const defaults = {
    field: "name.romanization",
    topText: "index",
    bottomText: "name.en",
    colorScale: "queen",
    letterAttr: "hermetic",
    flip: false,
    showDaat: false,
  };

  for (let key of Object.keys(defaults))
    opts[key] = router.query[key] || defaults[key];

  // From "true" / "false" to true / false
  opts.flip = opts.flip === "true";
  opts.showDaat = opts.showDaat === "true";

  const urlQuery = Object.entries(router.query)
    .map(([key, val]) => key + "=" + encodeURIComponent(val))
    .join("&");

  function set(key, value) {
    router.replace({
      query: { ...router.query, [key]: value },
    });
  }

  const fields = [
    "index",
    "angelicOrder.name.en",
    "angelicOrder.name.he",
    "angelicOrder.name.romanization",
    "archangel",
    "body",
    "bodyPos",
    "chakra.name.en",
    "chakra.name.sa",
    "chakra.name.romanization",
    "godName.name.en",
    "godName.name.he",
    "godName.name.romanization",
    "gdGrade.id",
    "gdGrade.name",
    "name.en",
    "name.he",
    "name.romanization",
    "planets",
    "scent",
    "stone",
    "soul.name.en",
    "soul.name.he",
    "soul.name.romanization",
  ];

  return (
    <>
      <Head>
        <title key="title">Kabbalistic Tree of Life </title>

        <meta property="og:site_name" content="magick.li" />
        <meta property="og:title" content="Kabbalistic Tree of Life" />
        <meta
          property="og:description"
          content="Customizable, interactive
          Tree of Life image and info."
        />
        <meta property="og:type" content="website" />
        {/* "https://magick.li/kabbalah/tree" + "?" + urlQuery */}
        <meta property="og:url" content="https://magick.li/kabbalah/tree" />
        {/* "https://magick.li/api/treeOfLife?v=1&fmt=webp&width=1200&height=630&" + urlQuery */}
        <meta
          property="og:image"
          content="https://magick.li/feature/kabbalah/tree.webp?v=2"
        />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Tree of Life svg" />
      </Head>
      <AppBar title="Tree of Life" navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>
          <div style={{ textAlign: "center" }}>
            Top text:{" "}
            <select
              name="topText"
              value={opts.topText}
              onChange={(e) =>
                e.preventDefault() || set("topText", e.target.value)
              }
            >
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <br />
            Center text:{" "}
            <select
              name="field"
              value={opts.field}
              onChange={(e) =>
                e.preventDefault() || set("field", e.target.value)
              }
            >
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <br />
            Bottom text:{" "}
            <select
              name="topText"
              value={opts.bottomText}
              onChange={(e) =>
                e.preventDefault() || set("bottomText", e.target.value)
              }
            >
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <br />
            <br />
            <span>
              Color:{" "}
              <select
                name="colorScale"
                value={opts.colorScale}
                onChange={(e) => set("colorScale", e.target.value)}
              >
                <option value="king">King Scale (Projective)</option>
                <option value="queen">Queen Scale (Receptive)</option>
              </select>
            </span>
            <br />
            <span>
              Letter Attribution:{" "}
              <select
                name="letterAttr"
                value={opts.letterAttr}
                onChange={(e) => set("letterAttr", e.target.value)}
              >
                <option value="hebrew">Hebrew Tree</option>
                <option value="hermetic">Western Hermetic Tree</option>
              </select>
              &nbsp;
              <a
                target="_blank"
                rel="noreferrer"
                href="https://hermetic.com/jwmt/v1n3/32paths"
              >
                *
              </a>
            </span>
            <br />
            <label>
              Flip tree:{" "}
              <input
                type="checkbox"
                value={opts.flip}
                onChange={(e) => set("flip", e.target.checked)}
              />
              &nbsp; (View from Behind / Body View)
            </label>
            <br />
            <label>
              Show Da&apos;at:{" "}
              <input
                type="checkbox"
                value={opts.showDaat}
                onChange={(e) => set("showDaat", e.target.checked)}
              />
            </label>
          </div>

          <br />

          <Tree
            field={opts.field}
            topText={opts.topText}
            bottomText={opts.bottomText}
            colorScale={opts.colorScale}
            letterAttr={opts.letterAttr}
            flip={opts.flip}
            showDaat={opts.showDaat}
          />

          <br />
          <br />

          <div style={{ textAlign: "center", fontSize: "90%" }}>
            Download:{" "}
            <a href="#" id="downloadSVG" onClick={encodeSVG}>
              SVG
            </a>
            <br />
            Copy to Clipboard:{" "}
            <a href="#" id="copySVG" onClick={copySVG}>
              SVG
            </a>
            {" | "}
            <a href="#" id="copyPNG" onClick={copyPNG}>
              PNG
            </a>
            <br />
            Hebrew Font:{" "}
            <a href="https://magick.li/fonts/NotoSansHebrew-Regular.ttf">
              NotoSansHebrew-Regular.ttf
            </a>
          </div>

          <br />

          <ol>
            {Object.values(Data.sephirah).map((sephirah) => (
              <li key={sephirah.id}>
                <Link
                  href={"/kabbalah/sephirah/" + sephirah.id}
                  color="secondary"
                >
                  {sephirah.name.romanization}
                </Link>
              </li>
            ))}
          </ol>

          <div style={{ fontSize: "60%" }}>
            <b>Credit:</b> Glyph inspired by{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Tree_of_life_bahir_Hebrew.svg">
              Tree of life bahir Hebrew.svg
            </a>{" "}
            from Wikimedia Commons.
          </div>
        </Box>
      </Container>
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
      />
    </>
  );
}

// export { getServerSideProps };
export default TreeOfLife;
