/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string || size === undefined) {return string;}
  if (size <= 0) {return '';}
  /* variant one */

  let strTrimed = string[0];
  for (let ind = 1, curSize = 1; ind <= string.length - 1; ind++) {
    if (string[ind - 1] === string[ind]) {
      curSize++;
    } else {
      curSize = 1;
    }
    if (curSize <= size) {strTrimed = strTrimed + string[ind];}
  }
  return strTrimed;

  /* variant two */
  /*
  let newArr = [];
  string.split('').
    reduce((currentCount, currentItem, index, array) => {
      if (array[index+1] && array[index] === array[index+1]) currentCount++; else currentCount = 1;
      if (currentCount <= size){
        newArr.push(array[index]);
      }
      return currentCount;
    },1);
  return newArr.join('');
   */
}
