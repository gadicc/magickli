import React from 'react';
//import Link from '@material-ui/core/Link';

import AppBar from '../../components/AppBar';
import Tiles from '../../components/Tiles';

import TreeOfLife from '../../components/kabbalah/TreeOfLife2';

const tiles = [
  {
    Component: function GradeTree() {
      return <TreeOfLife height="120%" field="gdGrade.id" topText="gdGrade.name" />
    },
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
