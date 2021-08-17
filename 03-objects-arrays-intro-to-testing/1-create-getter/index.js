/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const props = path.split('.');
  return function findProp(obj, ind = 0) {
    if (obj === undefined) {return;}
    if (ind === props.length - 1) {return (obj[props[ind]]);}
    else {
      return findProp(obj[props[ind]], ++ind);
    }
  };
  //return findProp(obj);
}
