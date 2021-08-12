/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrSort = [...arr];
  const caseFirst = param === 'asc' ? 'upper' : 'lower';

  arrSort.sort((a, b) =>{
    return param === 'asc' ?
      a.localeCompare(b, 'ru-en', {caseFirst: caseFirst}) :
      b.localeCompare(a, 'ru-en', {caseFirst: caseFirst});
  }
  );
  return arrSort;
}
