import React from 'react';
import lune from 'lune';

function moonPhaseName(phase) {
  if (phase === 0.5)
    return 'full-moon';

  if (phase > 0.5) {

    if (phase === 0.75)
      return 'last-quarter';
    if (phase > 0.75);
      return 'waning-crescent';
    return 'waning-gibbous';

  } else {

    if (phase === 0)
      return 'new-moon';
    if (phase === 0.25)
      return 'first-quarter';
    if (phase > 0.25)
      return 'waxing-gibbous';
    return 'waxing-crescent';

  }
}

const namesLocal = {
  en: {
    'new-moon': "New Moon",
    'waxing-crescent': "Waxing Crescent",
    'first-quarter': "First Quarter",
    'waxing-gibbous': "Waxing Gibbous",
    'full-moon': "Full Moon",
    'waning-gibbous': "Waning Gibbous",
    'last-quarter': "Last Quarter",
    'waning-crescent': "Waning Crescent",
  }
};

// Reactified version of
// https://github.com/tingletech/moon-phase/blob/gh-pages/moon-phase.js
function MoonDrawing({ phase, width, height }) {
  let mag, sweep;

  // the "sweep-flag" and the direction of movement change every quarter moon
  // zero and one are both new moon; 0.50 is full moon
  if (phase <= 0.25) {
      sweep = [ 1, 0 ];
      mag = 20 - 20 * phase * 4
  } else if (phase <= 0.50) {
      sweep = [ 0, 0 ];
      mag = 20 * (phase - 0.25) * 4
  } else if (phase <= 0.75) {
      sweep = [ 1, 1 ];
      mag = 20 - 20 * (phase - 0.50) * 4
  } else if (phase <= 1) {
      sweep = [ 0, 1 ];
      mag = 20 * (phase - 0.75) * 4
  } else {
      exit;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 200 162"
      width={width}
      height={height}
    >

      <defs>
  			<filter id="glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
          </feMerge>
  			</filter>
  		</defs>

      <path className="back" d="m100,5 a20,20 0 1,1 0,150 a20,20 0 1,1 0,-150"
        style={{ fill: 'white', filter: 'url(#glow)' }}/>
      <path className="back" d="m100,5 a20,20 0 1,1 0,150 a20,20 0 1,1 0,-150"
        style={{ fill: 'black' }}/>
      <path className="moon" d={
        `m100,5 a${mag},20 0 1,${sweep[0]} 0,150 a20,20 0 1,${sweep[1]} 0,-150`}
        style={{ fill: '#ebc815' }}/>
    </svg>
  )
}

function MoonWidget({ moonPadding='10px 0 5px 0' }) {
  const phaseData = lune.phase(new Date());
  const phaseValue = phaseData.phase;
  const phaseName = moonPhaseName(phaseValue);
  const phaseNameLocal = namesLocal.en[phaseName];
  // console.log(phaseData);

  return (
    <div style={{
        textAlign:'center',
        background: 'url(/night-sky.jpg)',
        backgroundSize: 'cover',
        height: '100%'
      }}>
      <div style={{padding: moonPadding}}>
        <MoonDrawing phase={phaseValue} height="85" />
      </div>
      <div style={{ color: '#cc5' }}>
        {phaseNameLocal}
      </div>
    </div>
  )
}

export default MoonWidget;
