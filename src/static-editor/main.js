var socket = io.connect()

var HTML_institution = document.getElementById('t_inst')
var HTML_election_title = document.getElementById('t_title')
var HTML_ballot = document.getElementById('b_master')

var g_config;

function main(config){
  var auth = prompt("Please enter administrator password.", "");
  console.log(config.admin_password);
  if (sha256(auth)!=config.admin_password){
    window.alert("Access is denied.")
    console.log(sha256(auth))
    return;
  }
  console.log(sha256(auth))
  console.log(config.admin_password)
  construct(config);
}

function construct(config){
  g_config = config
  HTML_institution.innerHTML = config.institution_title;
  HTML_election_title.innerHTML = config.election_title;
  for(i = 0; i < config.ballot.length; i++){
    var HTML_ballot_candidates = document.createElement("DIV");
    var TEXT_ballot_position = document.createTextNode(config.ballot[i].position);
    HTML_ballot_candidates.appendChild(TEXT_ballot_position);
    for(j = 0; j < config.ballot[i].candidates.length; j++){
      var HTML_ballot_candidate_name = document.createElement("DIV")
      HTML_ballot_candidate_name.id = config.ballot[i].candidates[j].id
      HTML_ballot_candidate_name.innerHTML = config.ballot[i].candidates[j].name
      HTML_ballot_candidate_name.setAttribute("ondblclick", "editCandidate(this)")
      HTML_ballot_candidate_name.className = "container_candidate_name"

      var HTML_ballot_candidate_name_count = document.createElement("DIV")
      HTML_ballot_candidate_name_count.className = "container_vote_count"
      HTML_ballot_candidate_name_count.id = config.ballot[i].candidates[j].id + "_cnt"

      HTML_ballot_candidates.appendChild(HTML_ballot_candidate_name);
      HTML_ballot_candidates.appendChild(HTML_ballot_candidate_name_count);

      // if j
    }
    HTML_ballot.appendChild(HTML_ballot_candidates)
  }
}

function constructVoteCount(voteCount){
  console.log(g_config);
  console.log(voteCount)
  for(i = 0; i < g_config.ballot.length; i++){
    for(j = 0; j < g_config.ballot[i].candidates.length; j++){
      if(voteCount[g_config.ballot[i].candidates[j].id]){
        document.getElementById(g_config.ballot[i].candidates[j].id+"_cnt").innerHTML = voteCount[g_config.ballot[i].candidates[j].id]
      }else{
        document.getElementById(g_config.ballot[i].candidates[j].id+"_cnt").innerHTML = 0
      }
    }
  }
}

function edit(e){
  var foo = document.createElement("INPUT");
  foo.setAttribute("type", "text");
  foo.setAttribute("value", e.innerHTML);
  foo.id = e.id+"_in"

  var bar = document.createElement("BUTTON");
  bar.innerHTML = "Save"
  bar.setAttribute("onclick", "save('"+e.id+"')");
  bar.className = "button_save"

  e.replaceChild(foo, e.childNodes[0]);
  e.appendChild(bar);
}

function editCandidate(e){
  var foo = document.createElement("INPUT");
  foo.setAttribute("type", "text");
  foo.setAttribute("value", e.innerHTML);
  foo.id = e.id+"_in"

  var fooid = document.createElement("INPUT");
  fooid.setAttribute("type", "text");
  fooid.setAttribute("value", e.id);
  fooid.id = e.id+"_in_id"

  var bar = document.createElement("BUTTON");
  bar.innerHTML = "Save"
  bar.setAttribute("onclick", "saveCandidate('"+e.id+"')");
  bar.className = "button_save"

  e.replaceChild(foo, e.childNodes[0]);
  e.appendChild(fooid);
  e.appendChild(bar);
}

function save(id){
  var e = document.getElementById(id);
  e.innerHTML = document.getElementById(id+"_in").value;
}

function saveCandidate(id){
  var e = document.getElementById(id);
  var v = document.getElementById(id+"_in").value;
  e.id = document.getElementById(id+"_in_id").value;
  e.innerHTML = document.getElementById(id+"_in").value;

  update_conf = {id: e.id, name: v, orig_id: id}
  socket.emit('save-data-candidate-update', update_conf);
}

socket.on('callback-load-data', function(data){
  main(data);
});
socket.on('callback-vote-count', function(data){
  constructVoteCount(data);
});
