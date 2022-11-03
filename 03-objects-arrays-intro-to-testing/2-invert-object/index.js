/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    if (typeof obj === 'object'){
        const myObj = {};
        for (const [key, value] of Object.entries(obj)){
          myObj[value] = key;
        }
        return myObj; 
    } else {
        return;
    }
}
