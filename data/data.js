const allData = {
  planet: require('./astrology/planets.json5').default,
  zodiac: require('./astrology/zodiac.json5').default,

  hebrewLetter: require('./hebrewLetters.json5').default,

  gdGrade: require('./hogd/grades.json5').default,

  angelicOrder: require('./kabbalah/angelicOrders.json5').default,
  godName: require('./kabbalah/godNames.json5').default,
  sephirah: require('./kabbalah/sephirot.json5').default,
  tolPath: require('./kabbalah/paths.json5').default,
};

function insertRefs(row) {
  Object.keys(row).forEach(key => {
    if (key.substr(key.length-2) == 'Id') {
      const name = key.substr(0, key.length-2);
      const value = row[key];
      if (allData[name] && allData[name][value]) {
        row[name] = allData[name][value];

        // move to end
        //let tmp = sephirah[key];
        //delete sephirah[key];
        //sephirah[key] = tmp;
      }
    } else if (typeof row[key+'Id'] === 'undefined' && typeof row[key] === 'object') {
      insertRefs(row[key]);
    }
  });
}

for (let [set, data] of Object.entries(allData)) {
  for (let row of Object.values(data)) {
    insertRefs(row);
  }
}

module.exports = allData;
