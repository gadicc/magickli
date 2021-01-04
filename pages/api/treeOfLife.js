import React from 'react';
import ReactDOMServer from 'react-dom/server';
import beautify from 'xml-beautifier';
import sharp from 'sharp';

import TreeOfLife from '../../components/kabbalah/TreeOfLife.js';

export default function treeOfLifeSVG(req, res) {
  let svgText = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
    ReactDOMServer.renderToStaticMarkup(
      <TreeOfLife {...req.query} />
    );

  // since React doesn't support namespace tags
  svgText = svgText.replace(
    'xmlns="http://www.w3.org/2000/svg"',
    'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
  );

  if (!req.query.fmt || req.query.fmt === 'svg') {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.end(beautify(svgText));

  } else {

    svgText = svgText.replace(
      /font-family="Sans"/g,
      'font-family="Arial"',
    );

    const s = sharp(new Buffer(svgText));

    if (req.query.width && req.query.height)
      s.resize(Number(req.query.width), Number(req.query.height));

    s.toFormat('png').pipe(res);

  }
}
