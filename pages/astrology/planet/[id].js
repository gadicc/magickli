import React from "react";
import { useRouter } from "next/router";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Link from "../../../src/Link";
import Copyright from "../../../src/Copyright";

import AppBar from "../../../components/AppBar";

import Data from "../../../data/data";
const planets = Data.planet;

export async function getStaticPaths() {
  const paths = Object.values(planets).map(
    (planet) => "/astrology/planet/" + planet.id
  );
  return { paths, fallback: true };
}

export async function getStaticProps({ params: { id } }) {
  return { props: { id } };
}

export default function Planet() {
  const navParts = [{ title: "Planets", url: "/astrology/planets" }];

  const router = useRouter();

  const { id } = router.query;
  if (!id) return null;

  const planet = planets[id];
  if (!planet) return null;

  return (
    <>
      <AppBar title={planet.name.en.en} navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>
          <p>
            <i>{planet.name.en.en}</i>
          </p>

          <table>
            <tbody>
              {Object.keys(planet).map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{JSON.stringify(planet[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Container>
    </>
  );
}
