import React from 'react';
import { useRouter } from 'next/router'

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ProTip from '../../../src/ProTip';
import Link from '../../../src/Link';
import Copyright from '../../../src/Copyright';

import AppBar from '../../../components/AppBar';

import Data from '../../../data/data';
const grades = Data.gdGrade;

export async function getStaticPaths() {
  const paths = Object.values(grades).map(grade => '/hogd/grade/' + grade.id);
  return { paths, fallback: true };
}

export async function getStaticProps({ params: { id } }) {
  return { props: { id }};
}

export default function Planet() {
  const navParts = [ { title: 'Grades', url: '/hogd/grades' } ];

  const router = useRouter();

  const { id } = router.query;
  if (!id)
    return null;

  const grade = grades[id];
  if (!grade)
    return null;

  return (
    <>
      <AppBar title={grade.name} navParts={navParts} />
      <Container maxWidth="sm">
        <Box my={4}>
          <p>
            <i>
              {grade.name} ({grade.id})
            </i>
          </p>

          <table>
            <tbody>
              {
                Object.keys(grade).map(key => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{JSON.stringify(grade[key])}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </Box>
      </Container>
    </>
  );
}
