const mongoID = require('mongodb').ObjectID
class aggs {
   constructor() { }

   projectArray(selector, selectorVal, array) {
      return [
         {
            $match: {
               [selector]: selectorVal
            }
         }, {
            $project: {
               _id: '$_id',
               [array]: `\$${array}`
            }
         }
      ]
   }


   matchId(id, projectField) {
      return [
         {
            $match: {
               _id: mongoID(id)
            }
         }, {
            $project: {
               _id: '$_id',
               name: '$name',
               [projectField]: `\$${projectField}`
            }
         }
      ]
   }

   pullObjFromArray(selector, selectorVal, array, uuid) {
      return [
         {
            $match: {
               [selector]: mongoID(selectorVal)
            }
         },
         {
            $unwind: `\$${array}`
         },
         {
            $match: {
               [`${array}` + '.uuid']: uuid
            }
         },
         {
            $project: {
               '_id': '$_id',
               [`${array}`]: `\$${array}`
            }
         }
      ]
   }
}

module.exports = new aggs();