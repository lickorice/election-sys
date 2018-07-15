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
      console.log(config.ballot[i].max_votes)
    }
  });
}

function construct(config){
  var HTML_ballot_submit = document.createElement('BUTTON');
  HTML_ballot_submit.className = "button_submit";
  HTML_ballot_submit.setAttribute('onclick', 'submit()');
  HTML_institution.innerHTML = config.institution_title;
  HTML_election_title.innerHTML = config.election_title;
  for(i = 0; i < config.ballot.length; i++){
    var HTML_ballot_candidates = document.createElement("DIV");
    var TEXT_ballot_position = document.createTextNode(config.ballot[i].position);
    HTML_ballot_candidates.appendChild(TEXT_ballot_position);
    for(j = 0; j < config.ballot[i].candidates.length; j++){
      var HTML_ballot_candidate_radio = document.createElement("INPUT");
      var HTML_ballot_candidate_label = document.createElement("LABEL");

      HTML_ballot_candidate_radio.id = config.ballot[i].candidates[j].id;
      HTML_ballot_candidate_radio.setAttribute("type", "checkbox");
      HTML_ballot_candidate_radio.setAttribute("name", config.ballot[i].position_id);
      HTML_ballot_candidate_radio.className = config.ballot[i].position_id

      HTML_ballot_candidate_label.setAttribute("for", HTML_ballot_candidate_radio.id)
      HTML_ballot_candidate_label.innerHTML = config.ballot[i].candidates[j].name;

      HTML_ballot_candidates.appendChild(HTML_ballot_candidate_radio);
      HTML_ballot_candidates.appendChild(HTML_ballot_candidate_label);
    }
    HTML_ballot.appendChild(HTML_ballot_candidates)
  }
  HTML_ballot.appendChild(HTML_ballot_submit);
}

function submit() {
  console.log("Attempting to submit...")
}

socket.on('callback-load-data', function(data){
  main(data);
});
