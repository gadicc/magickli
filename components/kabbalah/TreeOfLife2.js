import React from "react";
import dotProp from 'dot-prop';

import { useRouter } from 'next/router';

import Data from '../../data/data';
const _sephirot = Object.values(Data.sephirah);
const _paths = Data.tolPath;

// Draw order, which paths are "on top" of which, for clarity
const orderedPaths = {
  hebrew: [
    "4_5", "2_3", "7_8", // alef, shin, mem
    "1_2", "1_3", "1_6", // he, vav, dalet
    "2_5", "3_4", // zayin, qof <-- paths specific to hebrew tree
    "2_4", "2_6", "3_5", "3_6",
    "4_6", "4_7", "5_6", "5_8", "6_7", "6_8", "6_9", "7_9", "8_9", "9_10",
  ],
  hermetic: [
    "4_5", "2_3", "7_8",
    "1_2", "1_3", "1_6", "2_4", "2_6", "3_5", "3_6",
    "4_6", "4_7", "5_6", "5_8", "6_7", "6_8", "6_9", "7_9", "8_9", "9_10",
    "7_10", "8_10", // paths specific to hermetic tree
  ]
};

// Map to path data with that id
orderedPaths.hebrew = orderedPaths.hebrew.map(id => _paths[id]).reverse();
orderedPaths.hermetic = orderedPaths.hermetic.map(id => _paths[id]).reverse();

const firstUpper = string => string[0].toUpperCase() + string.substr(1);

function TreeOfLife({ width, height, labels, colorScale, field, topText = 'index',
    letterAttr = 'hermetic', active }) {
  const color = colorScale ? (colorScale+'Web') : 'queenWeb';
  width = width || '100%';
  field = field || 'index';

  if (!labels)
    labels = [0,1,2,3,4,5,6,7,8,9].map(i => dotProp.get(_sephirot[i], field));

  topText = [0,1,2,3,4,5,6,7,8,9].map(i => dotProp.get(_sephirot[i], topText));

  const fontSizeFromFieldName = {
    'index': 32,
    'name.en': 10,
    'name.he': 20,
    'name.romanization': 12,
    'godName.name.he': 20,
  };
  const fontSize = fontSizeFromFieldName[field] || 10;

  const pillar = [
    { name: 'severity', x: 47 },
    { name: 'equilibrium', x: 158 },
    { name: 'mercy', x: 269.5 },
  ];

  const rowStart = 45;
  const rowGap = 64;

  const sephirot = [
    { x: pillar[1].x, y: rowStart+rowGap*0, data: _sephirot[0], color: _sephirot[0].color[color], text: labels[0], textColor: _sephirot[0].color[color+'Text'] },
    { x: pillar[2].x, y: rowStart+rowGap*1, data: _sephirot[1], color: _sephirot[1].color[color], text: labels[1], textColor: _sephirot[1].color[color+'Text'] },
    { x: pillar[0].x, y: rowStart+rowGap*1, data: _sephirot[2], color: _sephirot[2].color[color], text: labels[2], textColor: _sephirot[2].color[color+'Text'] },
    { x: pillar[2].x, y: rowStart+rowGap*3, data: _sephirot[3], color: _sephirot[3].color[color], text: labels[3], textColor: _sephirot[3].color[color+'Text'] },
    { x: pillar[0].x, y: rowStart+rowGap*3, data: _sephirot[4], color: _sephirot[4].color[color], text: labels[4], textColor: _sephirot[4].color[color+'Text'] },
    { x: pillar[1].x, y: rowStart+rowGap*4, data: _sephirot[5], color: _sephirot[5].color[color], text: labels[5], textColor: _sephirot[5].color[color+'Text'] },
    { x: pillar[2].x, y: rowStart+rowGap*5, data: _sephirot[6], color: _sephirot[6].color[color], text: labels[6], textColor: _sephirot[6].color[color+'Text'] },
    { x: pillar[0].x, y: rowStart+rowGap*5, data: _sephirot[7], color: _sephirot[7].color[color], text: labels[7], textColor: _sephirot[7].color[color+'Text'] },
    { x: pillar[1].x, y: rowStart+rowGap*6, data: _sephirot[8], color: _sephirot[8].color[color], text: labels[8], textColor: _sephirot[8].color[color+'Text'] },
    { x: pillar[1].x, y: rowStart+rowGap*8, data: _sephirot[9], color: _sephirot[9].color[color], text: labels[9], textColor: _sephirot[9].color[color+'Text'] },
  ];

  const pathOpacity = active ? 0.1 : 1;

  const ref = React.useRef();
  const router = useRouter();

  React.useEffect(() => {
    ref.current.querySelectorAll('a').forEach(a => {
      a.onclick = function(e) {
        const href = a.getAttribute('xlink:href');
        e.preventDefault();
        router.push(href);
      }
    });
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 316 600"
      id="TreeOfLife"
      width={width}
      height={height}
      ref={ref}
    >

      {/* Paths */}
      <g id="paths">
        <style type="text/css">{`
          .outerPath { stroke: #000; stroke-width: 20; }
          .innerPath { stroke: #fff; stroke-width: 17; }
          .letter { font-size: 110%; }
        `}</style>
        {
          orderedPaths[letterAttr].map(path => {
            const parts = path.id.split('_');
            const start = sephirot[ Number(parts[0]) - 1 ];
            const end = sephirot[ Number(parts[1]) - 1 ];

            // Adjust position on path to avoid being covered over by other paths
            const specialPositions = {
              hebrew: {
                '2_5': 0.3,   '3_4': 0.3,   // Half way to 2_5,3_4 intersection
                '2_6': 0.333, '3_6': 0.333, // Level with y-cent of 1_6, 2_4, 3_5
                '6_9': 0.635                // Visible between 7_8 and Yesod
              },
              hermetic: {
                '2_6': 0.333, '3_6': 0.333, // In line with Center 1_6, 2_4, 3_5
                '6_9': 0.635                // Visible between 7_8 and Yesod
              }
            };
            const pos = specialPositions[letterAttr][path.id] || 0.5;

            const letterPos = {
              x: start.x + (end.x - start.x) * pos,
              y: start.y + (end.y - start.y) * pos
            };

            return (
              <a key={path.id} id={"path"+path.id} xlinkHref={"/kabbalah/path/"+path.id}>
                <path id={'outerPath'+firstUpper(path.id)} className="outerPath"
                    d={`M ${start.x},${start.y} L ${end.x},${end.y}`} />
                <path id={'innerPath'+firstUpper(path.id)} className="innerPath"
                    d={`M ${start.x},${start.y} L ${end.x},${end.y}`}>
                </path>
                <text className="letter" x={letterPos.x} y={letterPos.y}
                    textAnchor="middle" dominantBaseline="middle">
                  { path[letterAttr]?.hebrewLetter?.letter?.he }
                </text>
                <title>
                  Letter: { path[letterAttr]?.hebrewLetter?.letter?.he }
                  {
                    letterAttr === 'hermetic' &&
                    ", pathNo: " + path.hermetic.pathNo +
                    ", tarotId: " + path.hermetic.tarotId
                  }
                </title>
              </a>
            );
          })
        }
      </g>

      <g id="sephirot">
      {
        sephirot.map((s,i) => (
          <a key={i} id={s.data.id} xlinkHref={"/kabbalah/sephirah/"+s.data.id}>
            <circle
              cx={s.x}
              cy={s.y}
              r="39.2"
              fill={s.color.match(',') ? null : s.color}
              stroke="#000"
              strokeWidth="1.568"
              opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
            ></circle>

            {
              // Currently has fixed positions for Malkuth though.
              s.color.match(',') ? (
                <>
                  <path
                     id="circle88-7"
                     style={{fill:s.color.split(',')[0],stroke:'#000000',strokeWidth:1.568 }}
                     opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                     d="m 158,556.5 -27.71859,-27.71859 c -15.30855,15.30855 -15.30855,40.12863 0,55.43718 z" />
                  <path
                     id="circle88-1"
                     style={{fill:s.color.split(',')[1],stroke:'#000000',strokeWidth:1.568 }}
                     opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                     d="m 185.5,529 c -15.30855,-15.30855 -40.12863,-15.30855 -55.43718,0 L 158,556.5 Z" />
                  <path
                     id="circle88-10"
                     style={{fill:s.color.split(',')[2],stroke:'#000000',strokeWidth:1.568 }}
                     opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                     d="m 158,556.5 27.71859,27.71859 c 15.30855,-15.30855 15.30855,-40.12863 0,-55.43718 z" />
                  <path
                     id="circle88-2"
                     style={{fill:s.color.split(',')[3],stroke:'#000000',strokeWidth:1.568 }}
                     opacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
                     d="m 158,556.5 -27.71859,27.71859 c 15.30855,15.30855 40.12863,15.30855 55.43718,0 z" />
                </>

              ) : null
            }

            <text key={i}
              x={s.x}
              y={s.y}
              fill={s.textColor || 'black'}
              fillOpacity={ (!active || (active && active===s.data.id)) ? 1 : 0.1 }
              stroke="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeOpacity="1"
              strokeWidth="0.8"
              fontFamily="Sans"
              fontSize={fontSize}
              fontStyle="normal"
              fontWeight="normal"
              letterSpacing="0"
              wordSpacing="0"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              { s.text }
            </text>

            <path
               id={"topTextPath"+i}
               d={`M ${s.x-28},${s.y-3} c 1.5,-34 56.5,-34 58,0`}
               style={{ fill:'none', stroke:'none' }}
            />

            <text
               id={"topText_"+s.id}
               style={{
                  fontStyle:'normal', fontWeight:'normal', fontSize:'10px', fontFamily:'Sans',
                  letterSpacing:'-1.5px', wordSpacing:'0px',
                  fill:s.textColor||'black',
                  fillOpacity: (!active || (active && active===s.data.id)) ? 1 : 0.1,
                  stroke:'none',strokeWidth:'0.8px',strokeLinecap:'butt',strokeLinejoin:'miter',strokeOpacity:1}}>
              <textPath id="textPath945" xlinkHref={"#topTextPath"+i}
                  textAnchor="middle" dominantBaseline="middle"
                  startOffset="50%">
                {topText[i]}
              </textPath>
            </text>
          </a>
        ))
      }
      </g>
    </svg>
  );
}

export default TreeOfLife;
