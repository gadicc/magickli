import React from 'react';
import lune from 'lune';
import { DateTime } from 'luxon';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import AppBar from '../../components/AppBar';
import MoonDrawing from '../../components/astrology/Moon';

// https://www.unicode.org/L2/L2017/17304-moon-var.pdf
function uniMoon(moon, north = true, invert = true) {
  switch (moon) {
    case 'full-moon': return invert ? '🌑' : '🌕';
    default:
  }
}

export default function Moon() {
  const navParts = [ { title: 'Astrology', url: '/astrology' } ];

  const now = new Date();
  const hunt = lune.phase_hunt(now);
  const d = d => DateTime.fromJSDate(d).toLocaleString(DateTime.DATETIME_FULL);

  return (
    <>
      <style jsx>{`
        #page {
          background: url(/night-sky.jpg);
          background-size: cover;
          height: 100%;
        }
        .group {
          margin-bottom: 1em;
          padding: 5px;
          background: rgba(0,0,0,0.7)
        }
        .group > .title {
          color: #cc5;
        }
        .group > .date {
          color: white;
        }
      `}</style>
      <AppBar title="Moon" navParts={navParts} />

      <div id="page">
        <div style={{height: '155px'}}>
          <MoonDrawing moonPadding="20px 0 10px 0" />
        </div>

        <br />

        <div id="dates" style={{textAlign: 'center'}}>
          <div className="group">
            <div className="title">🌑 Last New Moon 🌑</div>
            <div className="date">{d(hunt.new_date)}</div>
          </div>

          <div className="group">
            <div className="title">🌓 First Quarter 🌓</div>
            <div className="date">{d(hunt.q1_date)}</div>
          </div>

          <div className="group">
            <div className="title">🌕 Full Moon 🌕</div>
            <div className="date">{d(hunt.full_date)}</div>
          </div>

          <div className="group">
            <div className="title">🌗 Third Quarter 🌗</div>
            <div className="date">{d(hunt.q3_date)}</div>
          </div>

          <div className="group">
            <div className="title">🌑 Next New Moon 🌑</div>
            <div className="date">{d(hunt.nextnew_date)}</div>
          </div>
        </div>

      </div>
    </>
  );
}
