import React, { useState } from "react";
import beautify from "xml-beautifier";
import { useRouter } from "next/router";
import Head from "next/head";
import CopyPasteExport, { ToastContainer } from "../../src/copyPasteExport";

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

function TreeOfLife() {
  const navParts = [{ title: "Kabbalah", url: "/kabbalah" }];
  const router = useRouter();
  const ref = React.useRef(null);

  const opts = {};
  const defaults = {
    field: "name.roman",
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
    "angelicOrder.name.roman",
    "archangel",
    "body",
    "bodyPos",
    "chakra.name.en",
    "chakra.name.sa",
    "chakra.name.roman",
    "godName.name.en",
    "godName.name.he",
    "godName.name.roman",
    "gdGrade.id",
    "gdGrade.name",
    "name.en",
    "name.he",
    "name.roman",
    "planets",
    "scent",
    "stone",
    "soul.name.en",
    "soul.name.he",
    "soul.name.roman",
  ];

  return (
    <>
      <Head>
        <title key="title">Kabbalistic Tree of Life </title>

        <meta property="og:site_name" content="magick.ly" />
        <meta property="og:title" content="Kabbalistic Tree of Life" />
        <meta
          property="og:description"
          content="Customizable, interactive
          Tree of Life image and info."
        />
        <meta property="og:type" content="website" />
        {/* "https://magick.ly/kabbalah/tree" + "?" + urlQuery */}
        <meta property="og:url" content="https://magick.ly/kabbalah/tree" />
        {/* "https://magick.ly/api/treeOfLife?v=1&fmt=webp&width=1200&height=630&" + urlQuery */}
        <meta
          property="og:image"
          content="https://magick.ly/feature/kabbalah/tree.webp?v=2"
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
            ref={ref}
          />

          <br />
          <br />

          <CopyPasteExport ref={ref} filename="TreeOfLife-magickli-export" />
          <div style={{ textAlign: "center", fontSize: "90%" }}>
            Hebrew Font:{" "}
            <a href="https://magick.ly/fonts/NotoSansHebrew-Regular.ttf">
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
                  {sephirah.name.roman}
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
