var https = require('https');
var program = require('commander');
var mongo = require('mongodb');

program
  .version('0.0.1')
  .option('-u, --user-id [type]', 'Habitica.com\'s user id')
  .option('-a, --api-key [type]', 'Habitica.com\'s user\'s api key')
  .option('-c, --connection-string [type]', 'mongo-db connection string [mongodb://localhost:27017/habitrpg?auto_reconnect=true]', 'mongodb://mongo/habitrpg?auto_reconnect=true')
  .parse(process.argv);

if (!program.userId) {
  console.log("ERROR: --user-id|-u is required");
  process.exit();
}

if (!program.apiKey) {
  console.log("ERROR: --api-key|-a is required");
  process.exit();
}

function insertTasks(db, tasks, type) {
    console.log("Inserting " + tasks.length + " " + type + " tasks...");
    var count = 0;
    tasks.forEach((task) => {
      db.collection('tasks').insertOne( task, function (err, res) {
        if (err) throw err;
        count = count + 1;
      });
    });
}

function insertUser(db, user) {
  console.log("Inserting user record...");
  db.collection('users').insertOne( user, function (err, res) {
    if (err) throw err;
    console.log("Inserted user record");
  });
}

function ImportUser(resp) {
  tasks = [];
  tasks.push.apply(tasks, resp.tasks["todos"]);
  tasks.push.apply(tasks, resp.tasks["dailys"]);
  tasks.push.apply(tasks, resp.tasks["habits"]);
  mongo.MongoClient.connect(program.connectionString, function(err, db) {
    console.log("Connected to mongodb.")
    insertTasks(db, resp.tasks["todos"], "todo");
    insertTasks(db, resp.tasks["dailys"], "daily");
    insertTasks(db, resp.tasks["habits"], "habit");
    insertUser(db, resp);
    console.log("Closing database...");
    db.close();
  });

}

var options = {
  host: 'habitica.com',
  port: 443,
  path: '/export/userdata.json',
  headers: {
    'x-api-user': program.userId,
    'x-api-key':  program.apiKey
  },
  method: 'GET'
};

var url = 'https://habitica.com/export/userdata.json';

console.log("Getting User data...");
https.get(options, function(res){
  var body = '';

  res.on('data', function(chunk){
    body += chunk;
  });

  res.on('end', function(){
    var resp = JSON.parse(body);
    console.log("User data received. Importing...");
    ImportUser(resp);
  });
}).on('error', function(e){
    console.log("Got an error: ", e);
});
