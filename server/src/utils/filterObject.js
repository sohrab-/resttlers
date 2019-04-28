export default (object, keys) =>
  Object.keys(object).reduce((accum, current) => {
    if (keys.indexOf(current) >= 0) {
      accum[current] = object[current];
    }
    return accum;
  }, {});
