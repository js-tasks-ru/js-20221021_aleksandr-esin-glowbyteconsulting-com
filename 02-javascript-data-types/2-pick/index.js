/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const ReturnObj = {};//создаем объект\
    //Преобразуем входной обхект в массив и применяем фильтр
    const filtarray = Object.entries(obj).filter( item => {  
        //проверяем, есть ли item массива в входном массиве fields через findIndex
        return ( (fields.findIndex(finditem => finditem==item[0])>=0) ? true : false );
    } );  
    //Создаем поля в объекте из полей массива
    for (let i in filtarray){
      ReturnObj[filtarray[i][0]]=filtarray[i][1];
    }
    return ReturnObj;
};
