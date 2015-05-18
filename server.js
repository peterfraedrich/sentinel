// CODEX
// 
// version -- 0.1
// version date -- 09-26-2014
// author -- Peter Fraedrich
//
//


// ================ SETUP ========================== // 

    var connect = require('connect');
    var fs = require('fs');
    var sys = require('sys');
    var exec = require('child_process').exec;
    var application_root = __dirname,
        express = require('express'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        errorhandler = require('errorhandler'),
            path = require('path');
            var databaseUrl = '127.0.0.1:27017/sentinel';
    var collections = ['agents'];
    var db = require('mongojs').connect(databaseUrl, collections);
    var auth = require('mongojs').connect(databaseUrl, ['clients']);
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


    // ============= API ======================= //

    // API Test
    app.get('/api', function (req, res) {
      res.end('API is up.');
    });

    // sentinel agent data push target
    app.post('/', function (req, res) {
      console.log(req.body.mydata);
      var jsonData = JSON.parse(req.body.mydata);
      console.log(jsonData);
      res.end('OK');
      auth.auth.findone({'clientID': jsonData.clientID}, function(req, client) {
        if (err || !client) {
          res.send('client not authorized')
        } else {
          db.agents.save(jsonData);
        };

      });

    });

    // TESTING // db data pull 
    app.get('/data', function (req, res) {

        data = db.agents.findOne({}, function (err, record) {
          if(err || !record) {
            res.writeHead(200,{'Content-Type' : 'application/text'});
            res.end('there was an error accessing the db')
          } else {
            res.writeHead(200, {'Content-Type' : 'text/html'});
            console.log(record.disk.disk_info.disk0)
            data = """<!DOCTYPE html>
                    <head>
                    <title>data-response</title>
                    </head>
                    <body>
                      TIMESTAMP: "+record.timestamp+"<br><br>
                      IP Address: "+record.ipaddr+"<br><br>
                      CPUs: "+record.cpu.cpu_count+"<br>
                      CPU %: "+record.cpu.cpu_total+"<br>
                      CPU 1: "+record.cpu.cpu_percpu.cpu1+"<br>
                      CPU 2: "+record.cpu.cpu_percpu.cpu2+"<br>
                      CPU 3: "+record.cpu.cpu_percpu.cpu3+" <br>
                      CPU 4: "+record.cpu.cpu_percpu.cpu4+"<br><br>
                      RAM Total: "+record.ram.ram_phystotal+"<br>
                      RAM Percent: "+record.ram.ram_physpercent+"<br>
                      RAM Free: "+record.ram.ram_physfree+"<br><br>
                      Swap Total: "+record.ram.ram_swaptotal+"<br>
                      Swap Percent: "+record.ram.ram_swappercent+"<br>
                      Swap Free: "+record.ram.ram_swapfree+"<br><br>
                      Disks: "+record.disk.disk_info.disk_count+"<br>
                      Disk 1 Total: "+record.disk.disk_info.disk0.disk_total+"<br>
                      Disk 1 %: "+record.disk.disk_info.disk0.disk_percent+"<br>
                      Disk 1 Used: "+record.disk.disk_info.disk0.disk_used+"<br>
                      Disk 1 Free: "+record.disk.disk_info.disk0.disk_free+"<br>
                      Disk 1 Path: "+record.disk.disk_info.disk0.dev+"<br>
                    </body>
                    </html>
                    """
            res.end(data);
            };
        });
      });





    // ============= LISTEN ==================== //

connect ()
  .use(connect.static(__dirname)).listen(httpPort);
console.log('Server listening on port 80');
app.listen(apiPort);
console.log('API listening on port 667');


// EOF