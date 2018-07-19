var socket = io.connect()

var HTML_institution = document.getElementById('t_inst')
var HTML_election_title = document.getElementById('t_title')
var HTML_ballot = document.getElementById('b_master')


function main(config){
  // Constructor method
  construct(config);
  // Limits checks
  $('input').on('change', function(){
    for(i = 0; i < config.ballot.length; i++)
    if($('.'+config.ballot[i].position_id+':checked').length > config.ballot[i].max_votes){
      this.checked = false;
    }
  });
}

function construct(config){
  var HTML_ballot_submit = document.createElement('BUTTON');
  HTML_ballot_submit.innerHTML = "SUBMIT VOTE"
  HTML_ballot_submit.className = "button_submit";
  HTML_ballot_submit.setAttribute('onclick', 'submit()');
  HTML_institution.innerHTML = config.institution_title;
  HTML_election_title.innerHTML = config.election_title;
  for(i = 0; i < config.ballot.length; i++){
    var HTML_ballot_position = document.createElement("DIV");
    HTML_ballot_position.className = "container_position"
    var HTML_ballot_candidates = document.createElement("DIV");
    HTML_ballot_candidates.className = "container_candidates"
    var HTML_ballot_position_title = document.createElement("DIV");
    HTML_ballot_position_title.innerHTML = config.ballot[i].position + " / Vote for " + config.ballot[i].max_votes;
    HTML_ballot_position_title.className = "container_position_title"
    HTML_ballot_position.appendChild(HTML_ballot_position_title);
    for(j = 0; j < config.ballot[i].candidates.length; j++){
      var HTML_ballot_candidate_radio = document.createElement("INPUT");
      var PLC_check = document.createElement("SPAN")
      var HTML_ballot_candidate_label = document.createElement("LABEL");

      PLC_check.className = "checkmark"

      HTML_ballot_candidate_radio.id = config.ballot[i].candidates[j].id;
      HTML_ballot_candidate_radio.setAttribute("type", "checkbox");
      HTML_ballot_candidate_radio.setAttribute("name", config.ballot[i].position_id);
      HTML_ballot_candidate_radio.className = config.ballot[i].position_id

      var TEXT_candidate = document.createTextNode(config.ballot[i].candidates[j].name);
      HTML_ballot_candidate_label.appendChild(TEXT_candidate);
      HTML_ballot_candidate_label.appendChild(HTML_ballot_candidate_radio);
      HTML_ballot_candidate_label.appendChild(PLC_check);
      HTML_ballot_candidate_label.className = "container_candidate_input"

      var HTML_ballot_candidate_container = document.createElement("DIV");
      HTML_ballot_candidate_container.className = "container_candidate"
      HTML_ballot_candidate_container.appendChild(HTML_ballot_candidate_label);
      HTML_ballot_candidates.appendChild(HTML_ballot_candidate_container)
    }
    HTML_ballot_position.appendChild(HTML_ballot_candidates);
    HTML_ballot.appendChild(HTML_ballot_position)
  }
  HTML_ballot.appendChild(HTML_ballot_submit);
}

function submit() {
  console.log("Attempting to submit...")
  var foo = document.getElementsByTagName("input")
  var votestr = ''
  var bar = []
  for(i = 0; i < foo.length; i++){
    if(foo[i].checked){
      bar.push(foo[i]);
    }
  }
  for(i = 0; i < bar.length; i++){
    votestr = votestr.concat(bar[i].id+" ")
  }
  socket.emit('submit-vote', votestr);

  var c = document.getElementsByTagName("INPUT");
  for(i = 0; i < c.length; i++){
    c[i].checked = false;
  }

  window.scrollTo(0, 0);

  var niggersshouldbeslaves = true;
  while(niggersshouldbeslaves){
    if('cfgp'==prompt("Thank you for voting! Please leave the precinct.")){
      niggersshouldbeslaves = false;
    }
  }
}

socket.on('callback-load-data', function(data){
  main(data);
});
