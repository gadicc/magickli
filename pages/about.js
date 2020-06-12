import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';

import AppBar from '../components/AppBar';
import sequences from '../src/sequences';

export default function Sequence() {
  return (
    <>
      <AppBar title="About" />
      <Container maxWidth="sm">
        <Box my={4}>
          <p>
            <i>
              Magick.li - the open source Magick app
            </i>
          </p>

          <p>
            This is primarily a reference app for all things
            magickal, to help me in my studies.  Maybe it will help
            you too.
          </p>

          <p>
            This is NOT an instruction app.  By using this app
            you acknowledge that you will not attempt any ritual
            here without prior instruction either by a qualified
            teacher or self-study with an appropriate book.  Attempting
            advanced magick without prior instruciton and training
            is dangerous and irreponsible.
          </p>

          <p>
            TODO - bibliography / starting points
          </p>

          <p>
            For questions, comments, feature requests, source code or to
            get involved, see
            {" "}
            <a href="https://github.com/gadicc/magickli">github.com/gadicc/magickli</a>
          </p>

          <p>
            Copyright (c) 2020 by Gadi Cohen, MIT licensed.
          </p>
        </Box>
      </Container>
    </>
  );
}
