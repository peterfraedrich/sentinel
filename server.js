// CODEX
// 
// version -- 0.1
// version date -- 09-26-2014
// author -- Peter Fraedrich
//
//


// ================ SETUP ========================== // 

    var connect = require('connect');
    var sys = require('sys');
    var exec = require('child_process').exec;
    var application_root = __dirname,
        express = require('express'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        errorhandler = require('errorhandler'),
            path = require('path');
            //var databaseUrl = '127.0.0.1:27017/codex';
    //var collections = ['entries'];
    //var db = require('mongojs').connect(databaseUrl, collections);
        var app = express();
  
    var httpPort = 80;
    var apiPort = 667;

// ================ CONFIG ========================= //
   
    var allowCrossDomain = function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', '*');
      //res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');
     
      // intercept OPTIONS method
      if (req.method === 'OPTIONS') {
        res.send(200);
      }
      else {
        next();
      }
    };

    app.use(allowCrossDomain);   // make sure this is is called before the router
    app.use(bodyParser());
    app.use(methodOverride());
    app.use(errorhandler());
    app.use(express.static(path.join(application_root, "public")));



    // ============= LISTEN ==================== //

connect ()
  .use(connect.static(__dirname)).listen(httpPort);
console.log('Server listening on port 80');
app.listen(apiPort);
console.log('API listening on port 667');
log("001","The sever started up successfully.");


// EOF