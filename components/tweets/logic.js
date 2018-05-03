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

   }

   async popular(req, res) {

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