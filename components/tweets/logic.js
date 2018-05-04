let valid = require('./validator')
let mongodb = require('./../../mongoDB/mongo')
let mongoID = require('mongodb').ObjectID
let self = null;
let boom = require('boom')
let uuid = require('uuid/v4')


// Change as needed
const databaseName = 'CS458'
const collectionName = 'trump-tweets-year'
module.exports = class tweetController extends mongodb {
   constructor() {
      super(databaseName, collectionName)
      self = this;
   }

   //GET Section
   async allWords(req, res) {
      let allAgg = [{
         $project: {
            all: '$allWords'
         }
      }]
      let results = await self.aggregate(allAgg)
      results = results[0].all
      for (var i of results) {
         i.name = i.term;
         i.weight = i.tf;
         delete i.term
         delete i.tf
      }
      res.json(results)
   }

   // used for sunburst chart
   async types(req, res) {
      let typeAgg = [{
         $project: {
            nouns: '$nouns',
            adjectives: '$adjectives',
            adverbs: '$adverbs',
            verbs: '$verbs'
         }
      }]
      let results = await self.aggregate(typeAgg)
      results = results[0]
      delete results._id

      let wordCloudData = []
      let idx = 0
      for (var i in results) {
         let curID = uuid()
         wordCloudData.push({
            name: i,
            id: curID,
            parent: ''
         })
         for (var j of results[i]) {
            wordCloudData.push({
               name: j.term,
               value: j.tf,
               parent: curID,
               id: uuid()
            })
         }
         idx++
      }
      res.json(wordCloudData)
   }

   async wordTimes(req, res) {

   }

   async nouns(req, res) {

   }

   async verbs(req, res) {

   }

   async adverbs(req, res) {

   }

   async adjectives(req, res) {

   }
}