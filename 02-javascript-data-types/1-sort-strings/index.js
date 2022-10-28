/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    let ReturnArray = arr.slice(0);
    ReturnArray.sort( (a, b) => a.localeCompare(b, ['enu', 'rus'], {caseFirst: 'upper'}) );
    
    //Инвертируем массив для desc параметра
    if (param !== 'asc'){
        ReturnArray.reverse();
    }
    return ReturnArray;
}
