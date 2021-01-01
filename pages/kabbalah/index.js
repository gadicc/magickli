import React from 'react';
//import Link from '@material-ui/core/Link';

import AppBar from '../../components/AppBar';
import Tiles from '../../components/Tiles';

const tiles = [
  {
    img: '/pics/treeOfLife.jpg',
    title: 'Sephirot',
    to: '/kabbalah/sephirot'
  },
];

function Kabbalah() {
  return (
    <>
      <AppBar title="Kabbalah" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Kabbalah;
