let router = require('express').Router();
let controller = require('./logic');
let validator = require('./validator');
let validate = require('express-validation')


module.exports = function() {
   controller = new controller();

   router.use((req, res, next) => next()); //init

   // [GET]
   router.get('/', controller.allWords)
   router.get('/popular', controller.popular)
   router.get('/nouns', controller.nouns)
   router.get('/verbs', controller.verbs)
   router.get('/adjectives', controller.adjectives)
   router.get('/adverbs', controller.adverbs)



   //[PATCH]
   //[POST]
   // [DELETE]



   router.use('*', (req, res) => res.json({ err: `Oh nose, ${req.originalUrl} doesn't exist` }))
   return router;
}

