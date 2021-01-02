import React, { useState } from 'react';
import beautify from 'xml-beautifier';
import { useRouter } from 'next/router';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Box from '@material-ui/core/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright';

import AppBar from '../../components/AppBar';
import Data from '../../data/data';
import Tree from '../../components/kabbalah/TreeOfLife';

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

function TreeOfLife() {
  const navParts = [ { title: 'Kabbalah', url: '/kabbalah' } ];
  const router = useRouter();

  const opts = {};
  const defaults = {
    field: 'name.romanization',
    topText: 'index',
    bottomText: 'name.en',
    colorScale: 'queen',
    letterAttr: 'hermetic',
  };

  for (let key of Object.keys(defaults))
    opts[key] = router.query[key] || defaults[key];

  function set(key, value) {
    router.replace({
      query: { ...router.query, [key]: value }
    });
  }

  const fields = [
    'index',
    'angelicOrder.name.en', 'angelicOrder.name.he', 'angelicOrder.name.romanization',
    'archangel',
    'body',
    'chakra',
    'godName.name.en', 'godName.name.he', 'godName.name.romanization',
    'gdGrade.id', 'gdGrade.name',
    'name.en', 'name.he', 'name.romanization',
    'planets',
    'scent',
    'stone',
    'soul',
  ];

  return (
    <>
      <AppBar title="Tree of Life" navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>

          <div style={{textAlign:'center'}}>
            Label: <select name="field" value={opts.field}
                onChange={ e => e.preventDefault() || set('field', e.target.value) }>
              {
                fields.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))
              }
            </select>
            <br />

            Top text: <select name="topText" value={opts.topText}
                onChange={ e => e.preventDefault() || set('topText', e.target.value) }>
              {
                fields.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))
              }
            </select>
            <br />

            Bottom text: <select name="topText" value={opts.bottomText}
                onChange={ e => e.preventDefault() || set('bottomText', e.target.value) }>
              {
                fields.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))
              }
            </select>
            <br />

            <span>
              Color: <select name="colorScale" value={opts.colorScale}
                  onChange={e => set('colorScale', e.target.value)}>
                <option value="king">King Scale (Projective)</option>
                <option value="queen">Queen Scale (Receptive)</option>
              </select>
            </span>

            <br />

            <span>
              Letter Attribution: <select name="letterAttr" value={opts.letterAttr}
                  onChange={e => set('letterAttr', e.target.value)}>
                <option value="hebrew">Hebrew Tree</option>
                <option value="hermetic">Western Hermetic Tree</option>
              </select>
              &nbsp;
              <a target="_blank" href="https://hermetic.com/jwmt/v1n3/32paths">*</a>
            </span>

          </div>

          <br />

          <Tree
            field={opts.field} topText={opts.topText} bottomText={opts.bottomText}
            colorScale={opts.colorScale} letterAttr={opts.letterAttr}
          />

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
            <b>Credit:</b> Image inspired by
            {" "}
            <a href="https://commons.wikimedia.org/wiki/File:Tree_of_life_bahir_Hebrew.svg">
              Tree of life bahir Hebrew.svg
            </a>
            {" "}
            from Wikimedia Commons.
          </div>

        </Box>
      </Container>
    </>
  );
}

export default TreeOfLife;
