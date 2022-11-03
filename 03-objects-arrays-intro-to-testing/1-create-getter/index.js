/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const fieldArray = path.split('.');
  
    function getChild({...myObj}){
        for (const key of fieldArray){
          if (fieldArray[fieldArray.length-1] === key){
              return myObj[key];
          } else if(Object.hasOwn(myObj, key)) {
            myObj = myObj[key];          
        } else{
            return ;
        }
        }
        return(fieldArray);
    }
    
    return getChild; 
}
