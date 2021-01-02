import TreeOfLife from '../../components/kabbalah/TreeOfLife';

function sephirahHref(s) {
  return "/hogd/grade/" + s.data.gdGradeId;
}

function pathHref() {
  return null;
}

function GradeTree({ ...props }) {
  return (
    <TreeOfLife
      field="gdGrade.id"
      topText="gdGrade.name"
      bottomText="gdGrade.element.symbol,gdGrade.orderId,gdGrade.planet.symbol"
      sephirahHref={sephirahHref}
      pathHref={pathHref}
      {...props}
    />
  )
}

export default GradeTree;
