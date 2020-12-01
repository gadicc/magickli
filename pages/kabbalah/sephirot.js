import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright';

import AppBar from '../../components/AppBar';
import sephirot from '../../data/kabbalah/sephirotGraph';
import TreeOfLife from '../../components/kabbalah/TreeOfLife2';

export default function Sephirot() {
  const navParts = [ { title: 'Kabbalah', url: '/kabbalah' } ];

  const [ field, setField ] = useState('name.romanization');
  const [ topText, setTopText ] = useState('index');
  const [ colorScale, setColorScale ] = useState('queen');

  const fields = [
    'index',
    'angelicOrder.name.en', 'angelicOrder.name.he', 'angelicOrder.name.romanization',
    'archangel',
    'body',
    'chakra',
    'godName.name.en', 'godName.name.he', 'godName.name.romanization',
    'name.en', 'name.he', 'name.romanization',
    'planets',
    'scent',
    'stone',
    'soul',
  ];

  return (
    <>
      <AppBar title="Sephirot" navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>

          <div style={{textAlign:'center'}}>
            Label: <select name="field" value={field}
                onChange={ e => e.preventDefault() || setField(e.target.value) }>
              {
                fields.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))
              }
            </select>
            <br />

            Top text: <select name="topText" value={topText}
                onChange={ e => e.preventDefault() || setTopText(e.target.value) }>
              {
                fields.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))
              }
            </select>
            <br />

            <span>&nbsp;&nbsp;&nbsp;</span>

            <span>
              Color: <select name="colorScale" value={colorScale}
                  onChange={e => setColorScale(e.target.value)}>
                <option value="king">King Scale (Projective)</option>
                <option value="queen">Queen Scale (Receptive)</option>
              </select>
            </span>
          </div>

          <br />

          <TreeOfLife field={field} topText={topText} colorScale={colorScale} />

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

          <div>
            <b>Image credit:</b> Modified version of
            {" "}
            <a href="https://commons.wikimedia.org/wiki/File:Tree_of_life_bahir_Hebrew.svg">
              Tree of life bahir Hebrew.svg
            </a>
            {" "}
            from Wikimedia Commons, released under CC-BY-SA 2.5.
          </div>

        </Box>
      </Container>
    </>
  );
}
