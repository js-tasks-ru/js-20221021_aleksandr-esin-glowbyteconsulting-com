/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const returnArray = [...arr]; //копируем массив

    const myCompare = (a, b) => {
        return a.localeCompare(b, ['rus', 'enu'], {caseFirst: 'upper'}); //Сортировка с учетом локали
    }
    
    returnArray.sort( (a,b) =>{
        if(param === 'asc'){
            return myCompare(a, b)
        }
        else if(param === 'desc'){
            return myCompare(b, a); 
        }
    }
    );

    return returnArray;
}
