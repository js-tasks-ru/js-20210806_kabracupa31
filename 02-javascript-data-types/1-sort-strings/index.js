/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let arrSort = arr.slice(0);
  let caseFirst;
  caseFirst = param === 'asc' ? caseFirst = 'upper' : caseFirst = 'lower';

  arrSort.sort((a, b) =>{
    return a.localeCompare(b, 'ru-en', { caseFirst: caseFirst });
  }
  );
  if (param === 'desc') {
    arrSort.reverse();
  }

  return arrSort;
}
