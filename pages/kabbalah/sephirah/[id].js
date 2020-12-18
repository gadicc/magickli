import React from 'react';
import { useRouter } from 'next/router'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ProTip from '../../../src/ProTip';
import Link from '../../../src/Link';
import Copyright from '../../../src/Copyright';

import AppBar from '../../../components/AppBar';

import Data from '../../../data/data';
const sephirot = Object.values(Data.sephirah);

export async function getStaticPaths() {
  const paths = sephirot.map(sephirah => '/kabbalah/sephirah/' + sephirah.id);
  return { paths, fallback: true };
}

export async function getStaticProps({ params: { id } }) {
  return { props: { id }};
}

export default function Sephirot() {
  const navParts = [ { title: 'Sephirot', url: '/kabbalah/sephirot' } ];

  const router = useRouter();

  const { id } = router.query;
  if (!id)
    return null;

  const sephirah = sephirot.find(sephirah => sephirah.id === id);
  if (!sephirah)
    return null;

  return (
    <>
      <AppBar title={sephirah.name.romanization} navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>
          <p>
            <i>
              {sephirah.name.romanization}
            </i>
          </p>

          <table>
            <tbody>
              {
                Object.keys(sephirah).map(key => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{JSON.stringify(sephirah[key])}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </Box>
      </Container>
    </>
  );
}
