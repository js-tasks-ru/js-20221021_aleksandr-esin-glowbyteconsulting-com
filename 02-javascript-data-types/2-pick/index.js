/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const returnObj = {};
  for (const [key, value] of Object.entries(obj)){ //деструкторизация объекта в цикле
      if (fields.includes(key)){  //проверка наличия ключа в массиве полей
        returnObj[key] = value;   //добавление полей в объект
      }
  }
  return returnObj;
    
  /*
  //Преобразуем входной обхект в массив и применяем фильтр
    const filtarray = Object.entries(obj).filter( item => {  
        return ( (fields.findIndex(finditem => finditem==item[0])>=0) ? true : false ); //проверяем, есть ли item массива в входном массиве fields через findIndex
    } );  

    //деструктизация + includes
    //Можно перебрать через for ... of 

    // ...array <- Спрет синтаксис
    
    const returnObj = {};//создаем объект
    //const returnObj = Object.fromEntries(filtarray); //создаем объект и заполняем его свойствами из массива
    //Создаем поля в объекте из полей массива
    for (const i in filtarray){
      returnObj[filtarray[i][0]]=filtarray[i][1];
    }
    return returnObj;*/
};
