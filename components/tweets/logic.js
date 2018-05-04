let mongodb = require('./../../mongoDB/mongo')
let uuid = require('uuid/v4')
let _ = require('lodash')

let self = null;

let moment = require('moment')

// Change as needed
const databaseName = 'CS458'
const collectionName = 'trump-tweets-year'
module.exports = class tweetController extends mongodb {
   constructor() {
      super(databaseName, collectionName)
      self = this;
   }

   //([GET]) Section
   // used for word cloud
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

   //used for heatmap
   async wordTimes(req, res) {
      self.switchCollection('trump-tweets-single')
      let timeAgg = [{
         $project: {
            time: '$createdDate'
         }
      }]
      let results = await self.aggregate(timeAgg)

      let tweetTimeArr = []
      for (var i of results) {
         tweetTimeArr.push([
            moment(i.time).utcOffset(-5).hour(),
            moment(i.time).utcOffset(-5).day(),
         ])
      }

      for (var i = 0; i <= 23; i++)
         for (var j = 0; j <= 6; j++)
            tweetTimeArr.push([i, j])

      let tweetTimeCount = compressArray(tweetTimeArr),
         final = []
      for (var i of tweetTimeCount)
         final.push(i.value.concat(i.count))
      final.sort().pop()
      res.json(final)
      self.switchCollection('trump-tweets-year')
   }

   async nouns(req, res) { }

   async verbs(req, res) { }

   async adverbs(req, res) { }

   async adjectives(req, res) { }
}

// thanks! https://gist.github.com/ralphcrisostomo/3141412
function compressArray(original) {

   var compressed = [];
   // make a copy of the input array
   var copy = original.slice(0);

   // first loop goes over every element
   for (var i = 0; i < original.length; i++) {

      var myCount = -1;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
         // console.log(original[i], copy[w])
         if (_.isEqual(original[i], copy[w])) {
            // increase amount of times duplicate is found
            myCount++;
            // sets item to undefined
            delete copy[w];
         }
      }

      if (myCount > -1) {
         var a = new Object();
         a.value = original[i];
         a.count = myCount;
         compressed.push(a);
      }
   }

   return compressed;
};