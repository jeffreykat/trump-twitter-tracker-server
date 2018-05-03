let app = require('express')();
let initTweets = require('./components/tweets/routes')
let bodyParser = require('body-parser')
let commandLineArgs = require('command-line-args')

module.exports = class server {
   constructor() {
      this.mongo = null;
      this.onInit();
   }

   async onInit() {
      this.addMiddleware();
      await this.grabRoutes();
      let CLA = this.pullCLA()

      app.listen(CLA.port, () => console.log(`Server running at port ${CLA.port}`))
   }

   pullCLA() {
      const options = [
         { name: 'port', alias: 'p', type: Number }
      ]
      let args = commandLineArgs(options)
      if (process.env.NODE_ENV == 'production')
         args.port = args.port ? args.port : process.env.PORT
      else
         args.port = args.port ? args.port : process.env.PORT
      return args
   }

   async grabRoutes() {
      app.use('/words', initTweets());
   }


   addMiddleware() {
      app.use(bodyParser.json())
      app.use(function(req, res, next) {
         res.header("Access-Control-Allow-Origin", "*");
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         next();
      });

      app.use(function(err, req, res, next) {
         console.log(err)
         res.status(400).json(err);
      }); // error handler for validator
   }
}