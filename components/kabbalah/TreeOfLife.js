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

const firstUpper = string => string[0].toUpperCase() + string.substr(1);

function LineOutline({ x1, x2, y1, y2, offset=5, ...args }) {
  const points = [ [x1,y1], [x2,y2] ];

  const cancel = x => x === 0 ? 0 : 1;
  const neg = x => x < 0 ? -1 : 1; // Unlike Math.sign(), no 0.
  const xDir = Math.sign(x1-x2);
  const yDir = Math.sign(y1-y2);

  function pythagOffset(xDir, yDir, axis) {
    //if (xDir === 0 && axis === 0 || yDir === 0 && axis === 1)
    //  return offset;
    if (xDir === 0 || yDir === 0)
      return offset;
    return Math.sqrt(offset*offset/2);
  }

  function calc(point, offsetDirection) {
    const off = pythagOffset(xDir, yDir, point);
    //const x = from[0]*pos[0] + to[0]*Number(!pos[0]);
    //const y = from[1]*pos[1] + to[1]*Number(!pos[1]);
    //
    //
//    const x = points[point][0] + (yDir!==0 && offset*offsetDirection*neg(xDir));
//    const y = points[point][1] + (xDir!==0 && offset*offsetDirection);
    const x = points[point][0] + pythagOffset(xDir,yDir,point) * offsetDirection * (cancel(yDir) * neg(xDir));
    const y = points[point][1] + pythagOffset(xDir,yDir,point) * offsetDirection * cancel(xDir);
    const result = `${x},${y}`;
   /*
    const result = pos.map((p, p2) => {
      points[p]
    });
    */
    console.log({ points, point, offsetDirection, result });
    return result;
  }

  return (
    <path
      {...args}
      d={
        `M ${calc(0,-1)} ` +
        `L ${calc(1,-1)} ` +
        `L ${calc(1,1)} ` +
        `L ${calc(0,1)} ` +
        `z`
      }
    />
  )
}

function TreeOfLife({ width, height, labels, colorScale, field, topText = 'index',
    bottomText='', letterAttr = 'hermetic', active, pathHref, sephirahHref,
    activePath }) {
  const color = colorScale ? (colorScale+'Web') : 'queenWeb';
  width = width || '100%';
  field = field || 'index';

  sephirahHref = sephirahHref || (s => "/kabbalah/sephirah/" + s.data.id);
  pathHref = pathHref || (path => "/kabbalah/path/" + path.id);

  if (!labels)
    labels = [0,1,2,3,4,5,6,7,8,9].map(i => dotProp.get(_sephirot[i], field));

  topText = [0,1,2,3,4,5,6,7,8,9].map(i => dotProp.get(_sephirot[i], topText));
  bottomText = [0,1,2,3,4,5,6,7,8,9].map(i =>
    bottomText.split(',').map(path => dotProp.get(_sephirot[i], path)).join(' '));

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

  let pathsToDraw = orderedPaths[letterAttr];
  if (activePath) {
    // Bring activePath to top
    pathsToDraw = pathsToDraw.filter(x => x !== activePath);
    pathsToDraw.unshift(activePath);
  }

  // Map to path data with that id
  pathsToDraw = pathsToDraw.map(id => _paths[id]).reverse()

  const outerSephirot = activePath && activePath.split('_').map(Number);

  function sephirahOpacity(sephirah) {
    if (!active && !activePath)
      return 1;

    if (active && active === sephirah.data.id)
      return 1;

    if (activePath) {
      if (outerSephirot.includes(sephirah.data.index))
        return 1;
    }

    return 0.1;
  }

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
      <style type="text/css">{`
        @font-face {
          font-family: 'Noto Sans';
          src: local('Noto Sans'), url('https://magick.li/fonts/NotoSans-Regular.ttf') format('truetype')
        }
        @font-face {
          font-family: 'Noto Sans Hebrew';
          src: local("Noto Sans Hebrew"), url('https://magick.li/fonts/NotoSansHebrew-Regular.ttf') format('truetype')
        }
        svg {
          font-family: 'Noto Sans', 'Noto Sans Hebrew', Arial, sans-serif;
        }
      `}</style>


      {/* Paths */}
      <g id="paths">
        <style type="text/css">{`
          .path {
            stroke: #000;
            stroke-width: 3;
            fill: #fff;
            paint-order: stroke fill markers;
          }
          .path.active {
            fill: #ffa;
          }
          .path.inactive {
            opacity: 0.2;
          }

          .letter { font-size: 110%; }
          .letter.inactive { opacity: 0.2 };
        `}</style>
        {
          pathsToDraw.map(path => {
            const parts = path.id.split('_');
            const start = sephirot[ Number(parts[0]) - 1 ];
            const end = sephirot[ Number(parts[1]) - 1 ];
            const activePathClass = (activePath ? activePath===path.id?' active':' inactive' : '');

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
              <a key={path.id} id={"path"+path.id} xlinkHref={pathHref(path)}>
                <LineOutline x1={start.x} y1={start.y} x2={end.x} y2={end.y} offset={8.5}
                  className={"path"+activePathClass} />
                <text className={"letter"+activePathClass} x={letterPos.x} y={letterPos.y}
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
          <a key={i} id={s.data.id} xlinkHref={sephirahHref(s)}>
            <circle
              cx={s.x}
              cy={s.y}
              r="39.2"
              fill={s.color.match(',') ? null : s.color}
              stroke="#000"
              strokeWidth="1.568"
              opacity={sephirahOpacity(s)}
            ></circle>

            {
              // Currently has fixed positions for Malkuth though.
              s.color.match(',') ? (
                <>
                  <path
                     id="circle88-7"
                     style={{fill:s.color.split(',')[0],stroke:'#000000',strokeWidth:1.568 }}
                     opacity={sephirahOpacity(s)}
                     d="m 158,556.5 -27.71859,-27.71859 c -15.30855,15.30855 -15.30855,40.12863 0,55.43718 z" />
                  <path
                     id="circle88-1"
                     style={{fill:s.color.split(',')[1],stroke:'#000000',strokeWidth:1.568 }}
                     opacity={sephirahOpacity(s)}
                     d="m 185.5,529 c -15.30855,-15.30855 -40.12863,-15.30855 -55.43718,0 L 158,556.5 Z" />
                  <path
                     id="circle88-10"
                     style={{fill:s.color.split(',')[2],stroke:'#000000',strokeWidth:1.568 }}
                     opacity={sephirahOpacity(s)}
                     d="m 158,556.5 27.71859,27.71859 c 15.30855,-15.30855 15.30855,-40.12863 0,-55.43718 z" />
                  <path
                     id="circle88-2"
                     style={{fill:s.color.split(',')[3],stroke:'#000000',strokeWidth:1.568 }}
                     opacity={sephirahOpacity(s)}
                     d="m 158,556.5 -27.71859,27.71859 c 15.30855,15.30855 40.12863,15.30855 55.43718,0 z" />
                </>

              ) : null
            }

            {
              field === 'gdGrade.id'

                ? <g>
                    <circle
                      cx={s.x - 20}
                      cy={s.y}
                      r="12"
                      fill="none"
                      stroke={s.textColor || 'black'}
                    />
                    <text
                      x={s.x - 20}
                      y={s.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={s.textColor || 'black'}
                    >{s.text.split('=')[0]}
                    </text>

                    <text
                      x={s.x}
                      y={s.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={s.textColor || 'black'}
                      fontSize="150%"
                    >=</text>

                    <rect
                      x={s.x + 10}
                      y={s.y - 10}
                      width="20"
                      height="20"
                      fill="none"
                      stroke={s.textColor || 'black'}
                    />
                    <text
                      x={s.x + 20}
                      y={s.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={s.textColor || 'black'}
                    >{s.text.split('=')[1]}
                    </text>
                  </g>

                : <text key={i}
                    x={s.x}
                    y={s.y}
                    fill={s.textColor || 'black'}
                    fillOpacity={sephirahOpacity(s)}
                    stroke="none"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    strokeOpacity="1"
                    strokeWidth="0.8"
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
            }

            {
              function() {
                const diameter = 64;
                const radius = diameter / 2;

                // http://digerati-illuminatus.blogspot.com/2008/05/approximating-semicircle-with-cubic.html
                const xValueInset = diameter * 0.05;
                const yValueOffset = radius * 4.0 / 3.0;

                return (
                  <g>
                    <path
                       id={"topTextPath"+i}
                       d={`M ${s.x-radius},${s.y} c ${xValueInset},-${yValueOffset} `
                         + `${diameter-xValueInset},-${yValueOffset} ${diameter},0`}
                       style={{ fill:'none', stroke:'none' }}
                    />

                    <text
                       id={"topText_"+s.id}
                       style={{
                          fontStyle:'normal', fontWeight:'normal', fontSize:'10px',
                          letterSpacing:'-0.5px', wordSpacing:'0px',
                          fill:s.textColor||'black',
                          fillOpacity: sephirahOpacity(s),
                          stroke:'none',strokeWidth:'0.8px',strokeLinecap:'butt',strokeLinejoin:'miter',strokeOpacity:1}}>
                      <textPath xlinkHref={"#topTextPath"+i}
                          textAnchor="middle" dominantBaseline="middle"
                          startOffset="50%">
                        {topText[i]}
                      </textPath>
                    </text>

                    <path
                       id={"bottomTextPath"+i}
                       d={`M ${s.x-radius},${s.y} c ${xValueInset},${yValueOffset} `
                         + `${diameter-xValueInset},${yValueOffset} ${diameter},0`}
                       style={{ fill:'none', stroke:'none' }}
                    />

                    <text
                       id={"bottomText_"+s.id}
                       style={{
                          fontStyle:'normal', fontWeight:'normal', fontSize:'10px',
                          letterSpacing:'-0.5px', wordSpacing:'0px',
                          fill:s.textColor||'black',
                          fillOpacity: sephirahOpacity(s),
                          stroke:'none',strokeWidth:'0.8px',strokeLinecap:'butt',strokeLinejoin:'miter',strokeOpacity:1}}>
                      <textPath xlinkHref={"#bottomTextPath"+i}
                          textAnchor="middle" dominantBaseline="middle"
                          startOffset="50%">
                        {bottomText[i]}
                      </textPath>
                    </text>
                  </g>
                );

              }()
            }

          </a>
        ))
      }
      </g>
    </svg>
  );
}

export default TreeOfLife;
