import React from "react";
import { useRouter } from "next/router";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Link from "../../../src/Link";
import Copyright from "../../../src/Copyright";

import AppBar from "../../../components/AppBar";
import TreeOfLife from "../../../components/kabbalah/TreeOfLife";
import Chakras from "../../../components/chakras/Chakras";

import Data from "../../../data/data";
const sephirot = Object.values(Data.sephirah);

export async function getStaticPaths() {
  const paths = sephirot.map((sephirah) => "/kabbalah/sephirah/" + sephirah.id);
  return { paths, fallback: true };
}

export async function getStaticProps({ params: { id } }) {
  return { props: { id } };
}

export default function Sephirot() {
  const navParts = [{ title: "Sephirot", url: "/kabbalah/tree" }];

  const router = useRouter();

  const { id } = router.query;
  if (!id) return null;

  const sephirah = sephirot.find((sephirah) => sephirah.id === id);
  if (!sephirah) return null;

  const otherLabels = Object.keys(sephirah).filter(
    (x) =>
      ![
        "id",
        "name",
        "color",
        "angelicOrder",
        "angelicOrderId",
        "godName",
        "godNameId",
        "chakra",
        "chakraId",
        "gdGrade",
        "gdGradeId",
      ].includes(x)
  );

  return (
    <>
      <style jsx>{`
        div.nameDiv {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        div.nameDiv > div {
          width: 50%;
          text-align: center;
        }

        div.colorsDiv > div {
          width: calc(50% - 10px);
          margin-right: 10px;
          display: inline-block;
          text-align: center;
          border: 1px solid #ccc;
        }

        div.color {
          width: 100%;
          _margin: 0 5px 0 5px;
          display: inline-block;
          padding: 10px 20px 10px 20px;
          text-align: center;
        }

        div.head {
          font-weight: bold;
        }

        div.nav {
          display: table;
          width: 100%;
        }
        div.nav > div {
          display: table-cell;
          vertical-align: middle;
        }
        div.prevNext {
          font-size: 150%;
        }

        table.main {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 20px;
        }
        table.main td {
          display: table-cell;
          vertical-align: middle;
        }
      `}</style>

      <AppBar title={sephirah.name.roman} navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>
          {/*
          <table width="100%">
            <style jsx>{`
              a.prevNextLink { text-decoration: none }
            `}</style>
            <tbody>
              <tr>
                <td>
                  <a className="prevNextLink" href="">
                    ⬅
                  </a>
                </td>
                <td>
                  <TreeOfLife height="80px" topText="" active={sephirah.id} />
                </td>
                <td>
                  <NameBlob name={sephirah.name} />
                </td>
                <td>
                  <a className="prevNextLink" href="">
                    ➡
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          */}

          <div className="nav">
            <div className="prevNext">
              {sephirah.prev && (
                <Link href={sephirah.prev} underline="none">
                  ❮
                </Link>
              )}
            </div>
            <div>
              <TreeOfLife height="150px" topText="" active={sephirah.id} />
            </div>
            <div className="prevNext">
              {sephirah.next && (
                <Link href={sephirah.next} underline="none">
                  ❯
                </Link>
              )}
            </div>
          </div>
          <br />

          {/*
          <span style={{ right: 0, marginRight: 15, position: 'fixed' }}>
            <TreeOfLife width="80px" topText="" active={sephirah.id} />
          </span>
          */}

          <table className="main">
            <tbody>
              <tr>
                <td>Name:</td>
                <td>
                  <div className="nameDiv">
                    <div>
                      <div>{sephirah.name.he}</div>
                      <div>{sephirah.name.roman}</div>
                    </div>
                    <div>{sephirah.name.en}</div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>God Name:</td>
                <td>
                  <div className="nameDiv">
                    <div>
                      <div>{sephirah.godName.name.he}</div>
                      <div>{sephirah.godName.name.roman}</div>
                    </div>
                    <div>{sephirah.godName.name.en}</div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>Angelic Host:</td>
                <td>
                  <div className="nameDiv">
                    <div>
                      <div>{sephirah.angelicOrder.name.he}</div>
                      <div>{sephirah.angelicOrder.name.roman}</div>
                    </div>
                    <div>{sephirah.angelicOrder.name.en}</div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>Colors:</td>
                <td>
                  <div className="colorsDiv">
                    <div
                      className="color"
                      style={{
                        background: sephirah.color.kingWeb,
                        color: sephirah.color.kingWebText || "black",
                      }}
                    >
                      <div className="head">King Scale</div>
                      <div className="text">{sephirah.color.king}</div>
                    </div>
                    <div
                      className="color"
                      style={{
                        background: sephirah.color.queenWeb.match(",")
                          ? "conic-gradient(" + sephirah.color.queenWeb + ")"
                          : sephirah.color.queenWeb,
                        color: sephirah.color.queenWebText || "black",
                      }}
                    >
                      <div className="head">Queen Scale</div>
                      <div className="text">{sephirah.color.queen}</div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>Chakra</td>
                <td>
                  <div className="nameDiv">
                    <div>
                      {sephirah.chakraId
                        ? sephirah.chakraId.substr(0, 1).toUpperCase() +
                          sephirah.chakraId.substr(1)
                        : "None"}
                    </div>
                    <div>
                      <Chakras
                        height="80px"
                        active={sephirah.chakraId || "none"}
                      />
                    </div>
                  </div>
                </td>
              </tr>

              {otherLabels.map((key) => (
                <tr key={key}>
                  <td>{key.substr(0, 1).toUpperCase() + key.substr(1)}:</td>
                  <td>
                    {typeof sephirah[key] === "string"
                      ? sephirah[key].substr(0, 1).toUpperCase() +
                        sephirah[key].substr(1)
                      : JSON.stringify(sephirah[key])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Container>
    </>
  );
}
