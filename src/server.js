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
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('data/data.json');
const db = low(adapter);

db.defaults({
  test: "Tester"
}).write();

// Initialize filestream
var fs = require('fs')
var config_content = fs.readFileSync("data/config.json")
if (config_content.length==0){
  console.log(lstr+"Config is empty, resetting to default settings...")
  resetConfig();
  var config_content = fs.readFileSync("data/config.json")
}
var config = JSON.parse(config_content);

console.log(db.get(config.ballot[0].candidates[0].id).write())

// Function to update:
function updateCandidate(target_id, target_name, original_id){
  for(i = 0; i < config.ballot.length; i++){
    for(j = 0; j < config.ballot[i].candidates.length; j++){
      console.log(lstr+config.ballot[i].candidates[j].id)
      if(config.ballot[i].candidates[j].id == original_id){
        config.ballot[i].candidates[j].name = target_name;
        config.ballot[i].candidates[j].id = target_id;
        fs.writeFile("data/config.json", JSON.stringify(config), (err)=>{
          if (err){
            console.log(lstr_err+err);
          }
        })
      }
    }
  }
}

function updatePosition(target_id, target_name, target_max_votes, original_id){
  for(i = 0; i < config.ballot.length; i++){
    if(config.ballot[i].position_id == original_id){
      config.ballot[i].position_id = target_id;
      config.ballot[i].max_votes = target_max_votes;
      config.ballot[i].position = target_name;
      fs.writeFile("data/config.json", JSON.stringify(config), (err)=>{
        if (err){
          console.log(lstr_err+err);
        }
      })
    }
  }
}

// Function to add a candidate:
function addCandidate(target_id, target_name, target_position){
  for(i = 0; i < config.ballot.length; i++){
    if(config.ballot[i].position_id == target_position){
      cand_obj = {name:target_name, id:target_id}
      config.ballot[i].candidates.push(cand_obj)
      fs.writeFile("data/config.json", JSON.stringify(config), (err)=>{
        if (err){
          console.log(lstr_err+err);
        }
      })
    }
  }
}

// Function to add a position
function addPosition(addAfter, target_name, target_id, target_max_votes){
  target = {position: target_name, position_id: target_id, max_votes: parseInt(target_max_votes), candidates:[]};
  config.ballot.splice(addAfter, 0, target);
  fs.writeFile("data/config.json", JSON.stringify(config), (err)=>{
    if (err){
      console.log(lstr_err+err);
    }
  })
}

// Function to delete a candidate:
function delCandidate(target_id){
  for(i = 0; i < config.ballot.length; i++){
    for(j = 0; j < config.ballot[i].candidates.length; j++){
      if(config.ballot[i].candidates[j].id == target_id){
        config.ballot[i].candidates.splice(j, 1);
        fs.writeFile("data/config.json", JSON.stringify(config), (err)=>{
          if (err){
            console.log(lstr_err+err);
          }
        })
      }
    }
  }
}

// Function to delete a position:
function delPosition(target_id){
  for(i = 0; i < config.ballot.length; i++){
    if(config.ballot[i].position_id == target_id){
      config.ballot.splice(i, 1);
      fs.writeFile("data/config.json", JSON.stringify(config), (err)=>{
        if (err){
          console.log(lstr_err+err);
        }
      })
    }
  }
}

// Callbacks on connect and emits:
io.on('connection', function(socket){
  socket.emit('callback-load-data', config);
  socket.on('submit-vote', function(data){
    console.log(lstr+"Vote received: "+data)
    voteArray = data.split(" ");
    voteArray.pop();

    for(i = 0; i < voteArray.length; i++){
      var current_votes = db.get(voteArray[i])
      if(!current_votes || isNaN(current_votes)){
        console.log('empty')
        current_votes = 1;
      } else {
        current_votes++;
      }
      console.log(lstr+current_votes)
      db.set(voteArray[i], current_votes).write();
    }
    // Submit vote code
  })
});
io_ed.on('connection', function(socket){
  socket.emit('callback-load-data', config);
  voteCount = JSON.parse(fs.readFileSync("data/data.json"))
  socket.emit('callback-vote-count', voteCount);

  socket.on('save-data-candidate-update', function(data){
    console.log(lstr+"Received "+data.id+": "+data.name)
    updateCandidate(data.id, data.name, data.orig_id);
  });
  socket.on('save-data-candidate-new', function(data){
    console.log(data);
    addCandidate(data.id, data.name, data.position_id)
  });
  socket.on('delete-candidate', function(data){
    delCandidate(data)
  });

  socket.on('save-position', function(data){
    updatePosition(data.pos_id, data.pos_name, data.pos_max, data.orig_pos_id);
  });
  socket.on('save-position-new', function(data){
    addPosition(data.addAfter, data.position_name, data.position_id, data.max_votes);
  });
  socket.on('delete-position', function(data){
    delPosition(data);
  });
});

// Resets the config file
function resetConfig(){
  var def_config = {
    admin_password:"6ed462938792f5a8867c3cc2a2f91b94d357d2d878e48ba6248eba26c5bf7ff0",
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
