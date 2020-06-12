import React from 'react';
import { useRouter } from 'next/router'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ProTip from '../../../src/ProTip';
import Link from '../../../src/Link';
import Copyright from '../../../src/Copyright';

import AppBar from '../../../components/AppBar';

import sephirot from '../../../data/kabbalah/sephirot';

export async function getStaticPaths() {
  const paths = sephirot.map(sephirah => '/kabbalah/sephirah/' + sephirah.id);
  return { paths, fallback: true };
}

export async function getStaticProps({ params: { id } }) {
  return { props: { id }};
}

export default function Sephirot() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  const sephirah = sephirot.find(sephirah => sephirah.id === id);
  const navParts = [ { title: 'Sephirot', url: '/kabbalah/sephirot' } ];

  return (
    <>
      <AppBar title={sephirah.name} navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>
          <p>
            <i>
              {sephirah.name}
            </i>
          </p>

          <table>
            {
              Object.keys(sephirah).map(key => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{sephirah[key]}</td>
                </tr>
              ))
            }
          </table>

        </Box>
      </Container>
    </>
  );
}
