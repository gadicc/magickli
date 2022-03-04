import React from 'react';
import { useRouter } from 'next/router'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ProTip from '../../../src/ProTip';
import Link from '../../../src/Link';
import Copyright from '../../../src/Copyright';

import AppBar from '../../../components/AppBar';
import GradeTree from '../../../components/hogd/GradeTree';

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
      <style jsx>{`
        div.nav { display: table; width: 100% }
        div.nav > div { display: table-cell; vertical-align: middle; }
        div.prevNext { font-size: 150%; }
      `}</style>
      <AppBar title={grade.name} navParts={navParts} />

      <Container maxWidth="sm">
        <Box my={4}>
          <div className="nav">
            <div className="prevNext">{grade.prev && <Link href={grade.prev} underline="none">❮</Link>}</div>
            <div>{
              grade.sephirah
              ? <GradeTree height="150px" topText="" active={grade.sephirah.id} />
              : <span>(no sephirah)</span>
            }</div>
            <div className="prevNext">{grade.next && <Link href={grade.next} underline="none">❯</Link>}</div>
           </div>
           <br />


          <p>
            <i>
              {grade.name} ({grade.id})
            </i>
          </p>

          <table>
            <tbody>
              {
                Object.keys(grade).map(key => {
                  let json;
                  try {
                    json = JSON.stringify(grade[key]);
                  } catch (e) {
                  }
                  return json && (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{json}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>

        </Box>
      </Container>
    </>
  );
}
