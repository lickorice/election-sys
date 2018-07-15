// Log message
var lstr = '[ SVR ] ';
var lstr_err = '[ ERR ] ';
// Setting up sockets
var express = require('express');
var express_app = express();
var express_app_ed = express();
var server = express_app.listen(1000, function(){
  console.log(lstr+'Started to listen on port 1000.');
});
var server_editor = express_app_ed.listen(1050, function(){
  console.log(lstr+'Started to listen on editor instance 1050');
})

var socket = require('socket.io');

express_app.use(express.static('static'));
express_app_ed.use(express.static('static-editor'));
var io = socket(server);
var io_ed = socket(server_editor);

console.log(lstr+'Sockets successfully initialized.')

// Setting up databases
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('data/votes.db', (err) => {
  if(err){
    console.log(lstr_err+err);
  }
  console.log(lstr+'Connected to the voting database')
})
// Create a table if not exists
db.run('CREATE TABLE IF NOT EXISTS votes(id INTEGER PRIMARY KEY AUTOINCREMENT, ballot_id TEXT)', (err)=>{
  if(err){
    console.log(lstr_err+err)
  }
  console.log(lstr+'Initialized voting table')
})

// Initialize filestream
var fs = require('fs')
var config_content = fs.readFileSync("data/config.json")
if (config_content.length==0){
  console.log(lstr+"Config is empty, resetting to default settings...")
  resetConfig();
  var config_content = fs.readFileSync("data/config.json")
}

// Callback on connect:
io.on('connection', function(socket){
  socket.emit('callback-load-data', JSON.parse(config_content));
});
io_ed.on('connection', function(socket){
  socket.emit('callback-load-data', JSON.parse(config_content));
});

// Resets the config file
function resetConfig(){
  var def_config = {
    admin_password:"6ED462938792F5A8867C3CC2A2F91B94D357D2D878E48BA6248EBA26C5BF7FF0",
    election_title:"Election Title",
    institution_title:"Default High School",
    ballot: [{
      position:"Grade A Representatives",
      position_id:"GAR",
      candidates:[{
        name:"Kanye West",
        id:"A-KW"
      },{
        name:"Kanye East",
        id:"A-KE"
      }],
      max_votes:1
    }, {
      position:"Grade B Representatives",
      position_id:"GBR",
      candidates:[{
        name:"50 Cent",
        id:"B-5C"
      },{
        name:"25 Cent",
        id:"B-2C"
      }, {
        name:"75 Cent",
        id:"B-7C"
      },{
        name:"1 Dollar",
        id:"B-1D"
      }],
      max_votes:3
    }]
  };

  var config_save = JSON.stringify(def_config);
  fs.writeFile("data/config.json", config_save, (err)=>{
    if (err){
      console.log(lstr_err+err);
    }
  })
}

//
