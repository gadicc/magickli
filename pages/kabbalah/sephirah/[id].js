import React from 'react';
import { useRouter } from 'next/router'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ProTip from '../../../src/ProTip';
import Link from '../../../src/Link';
import Copyright from '../../../src/Copyright';

import AppBar from '../../../components/AppBar';
import TreeOfLife from '../../../components/kabbalah/TreeOfLife2';

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
          <span style={{ right: 0, marginRight: 15, position: 'fixed' }}>
            <TreeOfLife width="80px" topText="" active={sephirah.id} />
          </span>

          <h1>
            {sephirah.name.romanization}
          </h1>

          <table>
            <tbody>
              {
                Object.keys(sephirah).map(key => (
                  <tr key={key}>
                    <td>{key.substr(0,1).toUpperCase() + key.substr(1)}:</td>
                    <td>{
                      typeof sephirah[key] === 'string'
                        ? sephirah[key].substr(0,1).toUpperCase() + sephirah[key].substr(1)
                        : JSON.stringify(sephirah[key])
                    }</td>
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
