import React from 'react';
import Link from '../../src/Link';
//import Link from '@material-ui/core/Link';

import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import AppBar from '../../components/AppBar';
import Tiles from '../../components/Tiles';

const tiles = [
  {
    img: '/pics/planets2013.jpg',
    title: 'Planets',
    to: '/astrology/planets'
  },
  {
    img: '/pics/astrology.jpg',
    title: 'Zodiac',
    to: '/astrology/zodiac'
  },
];

function Astrology() {
  return (
    <>
      <AppBar title="Astrology" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Astrology;
