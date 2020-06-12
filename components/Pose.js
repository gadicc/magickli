import styles from './Pose.module.css';

import poses from '../src/poses';

function Pose({ id }) {
  const pose = poses[id] || {};
  const name = pose.name || id.replace(/\-/g, ' ').replace(/\b[a-z]{1,1}/g, c => c.toUpperCase());

  const imgUrls = [];

  if (pose.files) {
    if (typeof pose.files === "number")
      for (let i=1; i<= pose.files; i++)
        imgUrls.push('/pics/' + id + '-' + i + '.jpg');
  } else
    imgUrls.push('/pics/' + id + '.jpg');

  return (
    <div className={styles.div}>
      <div className={styles.caption}>{name}</div>
      {
        imgUrls.map(url => (
          <img className={styles.img} key={url} src={url} />
        ))
      }
    </div>
  )
}

export default Pose;
