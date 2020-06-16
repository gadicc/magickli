import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright';

import AppBar from '../../components/AppBar';
import sephirot from '../../data/kabbalah/sephirotGraph';
import TreeOfLife from '../../components/kabbalah/TreeOfLife';

export default function Sephirot() {
  const navParts = [ { title: 'Kabbalah', url: '/kabbalah' } ];

  return (
    <>
      <AppBar title="Sephirot" navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>
          <TreeOfLife />

          <div>
            <b>Image credit:</b>
            {" "}
            <a href="https://commons.wikimedia.org/wiki/File:Tree_of_life_hebrew.svg">
              Tree_of_life_hebrew.svg
            </a>
            {" "}
            from Wikimedia Commons, released under CC-BY-SA 2.5, and modified
            for use in this app.
          </div>

          <ol>
            {
              sephirot.map(sephirah => (
                <li key={sephirah.id}>
                  <Link href={"/kabbalah/sephirah/"+sephirah.id} color="secondary">
                    {sephirah.name.romanization}
                  </Link>
                </li>
              ))
            }
          </ol>

        </Box>
      </Container>
    </>
  );
}
