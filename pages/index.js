import React from 'react';
//import Link from '@mui/material/Link';

import AppBar from '../components/AppBar';
import Tiles from '../components/Tiles';

import GDLogoSquished from '../src/goldendawn-logo-squished.svg';

const tiles = [
  {
    img: '/pics/about.png',
    title: 'About',
    to: '/about'
  },
  {
    img: '/pics/astrology.jpg',
    title: 'Astrology',
    to: '/astrology'
  },
  {
    img: '/pics/30aethyrs.jpg',
    title: 'Enochian',
    to: 'https://enochian.app/'
  },
  {
    Component: () => <GDLogoSquished width="100%"/>,
    title: 'Golden Dawn',
    to: '/hogd/'
  },
  {
    img: '/pics/Tree_of_Life,_Medieval.jpg',
    title: 'Kabbalah',
    to: '/kabbalah'
  },
];




function Index() {
  return (
    <>
      <AppBar title="Magick.li" />
      <Tiles tiles={tiles} />
    </>
  );
}

export default Index;
