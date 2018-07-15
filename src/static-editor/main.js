var socket = io.connect()

var HTML_institution = document.getElementById('t_inst')
var HTML_election_title = document.getElementById('t_title')
var HTML_ballot = document.getElementById('b_master')

function main(config){
  // Constructor method
  var auth = prompt("Please enter administrator password.", "");
  if (sha256(auth)!=config.admin_password){
    window.alert("Access is denied.")
    return;
  }
  console.log(config.admin_password)
  console.log(sha256(auth))
  construct(config);
}

function construct(config){
  HTML_institution.innerHTML = config.institution_title;
  HTML_election_title.innerHTML = config.election_title;
  for(i = 0; i < config.ballot.length; i++){
    var HTML_ballot_candidates = document.createElement("DIV");
    var TEXT_ballot_position = document.createTextNode(config.ballot[i].position);
    HTML_ballot_candidates.appendChild(TEXT_ballot_position);
    for(j = 0; j < config.ballot[i].candidates.length; j++){
      var HTML_ballot_candidate_name = document.createElement("DIV")
      HTML_ballot_candidate_name.id = config.ballot[i].candidates[j].id;
      HTML_ballot_candidate_name.innerHTML = config.ballot[i].candidates[j].name;
      HTML_ballot_candidate_name.setAttribute("ondblclick", "editCandidate(this)")
      HTML_ballot_candidates.appendChild(HTML_ballot_candidate_name);
    }
    HTML_ballot.appendChild(HTML_ballot_candidates)
  }
}

function edit(e){
  var foo = document.createElement("INPUT");
  foo.setAttribute("type", "text");
  foo.setAttribute("value", e.innerHTML);
  foo.id = e.id+"_in"

  var bar = document.createElement("BUTTON");
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
  e.id = document.getElementById(id+"_in_id").value;
  e.innerHTML = document.getElementById(id+"_in").value;
}

socket.on('callback-load-data', function(data){
  main(data);
  console.log(data)
});
