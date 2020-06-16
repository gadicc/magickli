const sephirot = require('./sephirot').default.slice();

const mapping = {
  angelicOrder: require('./angelicOrders').default,
  godName: require('./godNames').default,
}


for (let i=0; i < sephirot.length; i++) {
  const sephirah = sephirot[i];
  Object.keys(sephirah).forEach(key => {
    if (key.substr(key.length-2) == 'Id') {
      const name = key.substr(0, key.length-2);
      const value = sephirah[key];
      if (mapping[name] && mapping[name][value]) {
        sephirah[name] = mapping[name][value];

        // move to end
        let tmp = sephirah[key];
        delete sephirah[key];
        sephirah[key] = tmp;
      }
    }
  });
}

export default sephirot;
