import React, { useState } from 'react';
import beautify from 'xml-beautifier';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Box from '@material-ui/core/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright';

import AppBar from '../../components/AppBar';
import Data from '../../data/data';
import TreeOfLife from '../../components/kabbalah/TreeOfLife2';

function encodeSVG() {
  let svgText = document.getElementById('TreeOfLife').outerHTML;
  const download = document.getElementById('downloadSVG');

  // since React doesn't support namespace tags
  svgText = svgText.replace(
    'xmlns="http://www.w3.org/2000/svg"',
    'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
  );

  const pretty = beautify(svgText);
  const data = encodeURIComponent(pretty);

  download.setAttribute('download', 'TreeOfLife-magickli-export.svg');
  download.setAttribute('href-lang', 'image/svg+xml');
  download.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + data);
}

export default function Sephirot() {
  const navParts = [ { title: 'Kabbalah', url: '/kabbalah' } ];

  const [ field, setField ] = useState('name.romanization');
  const [ topText, setTopText ] = useState('index');
  const [ colorScale, setColorScale ] = useState('queen');
  const [ letterAttr, setLetterAttr ] = useState('hermetic');

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

            <span>
              Color: <select name="colorScale" value={colorScale}
                  onChange={e => setColorScale(e.target.value)}>
                <option value="king">King Scale (Projective)</option>
                <option value="queen">Queen Scale (Receptive)</option>
              </select>
            </span>

            <br />

            <span>
              Letter Attribution: <select name="letterAttr" value={letterAttr}
                  onChange={e => setLetterAttr(e.target.value)}>
                <option value="hebrew">Hebrew Tree</option>
                <option value="hermetic">Western Hermetic Tree</option>
              </select>
              &nbsp;
              <a target="_blank" href="https://hermetic.com/jwmt/v1n3/32paths">*</a>
            </span>

          </div>

          <br />

          <TreeOfLife field={field} topText={topText} colorScale={colorScale}
            letterAttr={letterAttr}/>

          <div>
            <a href="#" id="downloadSVG" onClick={encodeSVG}>Download as SVG</a>
          </div>

          <br />

          <div>
            Note: TextOnPath for RTL text (e.g. Hebrew) is&nbsp;
            <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=374526">
              broken in Chrome
            </a>.
            You'll see the TopText reversed.  It works in Firefox, or download
            and view outside of youor browser.
          </div>

          <ol>
            {
              Object.values(Data.sephirah).map(sephirah => (
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
