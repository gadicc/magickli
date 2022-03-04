import React from 'react';
//import Link from '@mui/material/Link';

import AppBar from '../../components/AppBar';
import Tiles from '../../components/Tiles';
import GradeTree from '../../components/hogd/GradeTree';

const tiles = [
  {
    Component: () => <GradeTree height="120%" />,
    title: 'Grades',
    to: '/hogd/grades'
  },
];

function HOGD() {
  return (
    <>
      <AppBar title="HOGD" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default HOGD;
