/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    const stringArr = [...string];
    const calcArray = [];
    let retString = '';
    let lastChar = '';
    let sum = 0;
    for (const value of stringArr){
      if (value === lastChar){
        sum++;
      } else {
        sum = 1;
      }
      calcArray.push([value, sum]);
      lastChar = value;
    }
    for (const item of calcArray){
      if (item[1] <= size || size === undefined){
        retString = retString + item[0];
      }
    }
    return retString;
}
