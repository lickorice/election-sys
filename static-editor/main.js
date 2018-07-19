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
    return;
  }
  construct(config);
}

function construct(config){
  g_config = config
  HTML_institution.innerHTML = config.institution_title;
  HTML_election_title.innerHTML = config.election_title;
  for(i = 0; i < config.ballot.length; i++){
    var HTML_ballot_candidates = document.createElement("DIV");
    HTML_ballot_candidates.className = "container_positions";
    HTML_ballot_candidates.id = config.ballot[i].position_id;

    var HTML_ballot_position_title = document.createElement("DIV");
    var foo = document.createElement("BUTTON");
    foo.className = "button_add"
    foo.innerHTML = "ADD A POSITION AFTER THIS"
    foo.setAttribute("onclick", "addPosition("+i+")")
    var foobar = document.createElement("BUTTON");
    foobar.className = "button_edit"
    foobar.innerHTML = "EDIT THIS POSITION"
    foobar.setAttribute("onclick", "editPosition('"+config.ballot[i].position_id+"', "+config.ballot[i].max_votes+", "+i+")")

    HTML_ballot_position_title.id = config.ballot[i].position_id+"_tit"

    var HTML_ballot_position_title_text = document.createElement("DIV")
    HTML_ballot_position_title_text.innerHTML = config.ballot[i].position
    HTML_ballot_position_title_text.id = config.ballot[i].position_id+"_txt"

    var HTML_ballot_position_title_max = document.createElement("DIV")
    HTML_ballot_position_title_max.innerHTML = "(Max votes: "+config.ballot[i].max_votes+")"

    HTML_ballot_position_title.appendChild(HTML_ballot_position_title_text);
    HTML_ballot_position_title.appendChild(HTML_ballot_position_title_max);
    HTML_ballot_position_title.appendChild(foo);
    HTML_ballot_position_title.appendChild(foobar);
    HTML_ballot_position_title.className = "container_positions_title";

    HTML_ballot_candidates.appendChild(HTML_ballot_position_title);
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

    // Insert ADD button
    var HTML_ballot_add_candidate = document.createElement("BUTTON");
    HTML_ballot_add_candidate.className = "button_add";
    HTML_ballot_add_candidate.id = config.ballot[i].position_id;
    HTML_ballot_add_candidate.innerHTML = "ADD A CANDIDATE"
    HTML_ballot_add_candidate.setAttribute("onclick", "addCandidate(this)")

    HTML_ballot_candidates.appendChild(HTML_ballot_add_candidate)
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
  foo.className = "text_edit_1"

  var bar = document.createElement("BUTTON");
  bar.innerHTML = "Save"
  bar.setAttribute("onclick", "save('"+e.id+"')");
  bar.className = "button_add"

  e.replaceChild(foo, e.childNodes[0]);
  e.appendChild(bar);
}

function editCandidate(e){
  document.getElementById(e.id).setAttribute("ondblclick", "null");

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
  bar.setAttribute("onclick", "saveCandidate('"+e.id+"', "+i+")");
  bar.className = "button_add"

  var bardel = document.createElement("BUTTON");
  bardel.innerHTML = "Delete"
  bardel.setAttribute("onclick", "deleteCandidate('"+e.id+"')");
  bardel.className = "button_delete"

  e.replaceChild(foo, e.childNodes[0]);
  e.appendChild(fooid);
  e.appendChild(bar);
  e.appendChild(bardel);
}

function editPosition(position_id, max, i){
  var title_container = document.getElementById(position_id+"_tit")
  var foo = document.createElement("INPUT");
  foo.setAttribute("type", "text");
  foo.setAttribute("value", document.getElementById(position_id+"_txt").innerHTML);
  foo.id = position_id+"_posname";

  var fooid = document.createElement("INPUT");
  fooid.setAttribute("type", "text");
  fooid.setAttribute("value", position_id);
  fooid.id = position_id+"_posid";

  var bar = document.createElement("INPUT");
  bar.setAttribute("type", "text");
  bar.setAttribute("value", max);
  bar.id = position_id+"_posmax";

  var car = document.createElement("BUTTON");
  car.innerHTML = "Save"
  car.setAttribute("onclick", "savePosition('"+position_id+"', "+i+")");
  car.className = "button_add"

  var carlos = document.createElement("BUTTON");
  carlos.innerHTML = "Delete"
  carlos.setAttribute("onclick", "deletePosition('"+position_id+"', this)");
  carlos.className = "button_delete"

  title_container.innerHTML = '';
  title_container.appendChild(foo);
  title_container.appendChild(fooid);
  title_container.appendChild(bar);
  title_container.appendChild(car);
  title_container.appendChild(carlos);
}

function save(id){
  var e = document.getElementById(id);
  e.innerHTML = document.getElementById(id+"_in").value;

  var keyup;
  if(id == 't_inst'){
    keyup = "institution_title"
  }else{
    keyup = "election_title"
  }
  update_conf = {key: keyup, value: e.innerHTML}
  socket.emit('save-value', update_conf)
}

function saveValue(nkey, nvalue){
  update_conf = {key: nkey, value: nvalue}
  socket.emit('save-value', update_conf)
}

function saveCandidate(id){
  var e = document.getElementById(id);
  var v = document.getElementById(id+"_in").value;
  e.setAttribute("ondblclick", "editCandidate(this)")
  e.id = document.getElementById(id+"_in_id").value;
  e.innerHTML = document.getElementById(id+"_in").value;

  update_conf = {id: e.id, name: v, orig_id: id}
  socket.emit('save-data-candidate-update', update_conf);
}

function saveNewCandidate(pos_id, e){
  var name = document.getElementById(pos_id+'_new').value;
  var c_id = document.getElementById(pos_id+'_new_id').value;

  var p_cont = document.getElementById(pos_id+"_cont");
  p_cont.id = c_id;
  p_cont.innerHTML = name;
  p_cont.setAttribute("ondblclick", "editCandidate(this)");

  update_conf = {id: c_id, name: name, position_id: pos_id}
  socket.emit('save-data-candidate-new', update_conf);
}

function savePosition(id, i){
  var posid = document.getElementById(id+"_posid").value;
  var posnm = document.getElementById(id+"_posname").value;
  var posmx = document.getElementById(id+"_posmax").value;

  var poscontainer = document.getElementById(id+"_tit");
  var foo = document.createElement("BUTTON");
  foo.className = "button_add"
  foo.innerHTML = "Add a position after this"
  foo.setAttribute("onclick", "addPosition("+i+")")
  var foobar = document.createElement("BUTTON");
  foobar.className = "button_edit"
  foobar.innerHTML = "Edit this position"
  foobar.setAttribute("onclick", "editPosition('"+posid+"', "+posmx+", "+i+")")

  poscontainer.id = posid+"_tit"

  var poscontainer_text = document.createElement("DIV")
  poscontainer_text.innerHTML = posnm
  poscontainer_text.id = posid+"_txt"

  var poscontainer_max = document.createElement("DIV")
  poscontainer_max.innerHTML = "(Max votes: "+posmx+")"

  poscontainer.innerHTML = ''
  poscontainer.appendChild(poscontainer_text);
  poscontainer.appendChild(poscontainer_max);
  poscontainer.appendChild(foo);
  poscontainer.appendChild(foobar);

  update_conf = {orig_pos_id: id, pos_id: posid, pos_max: posmx, pos_name: posnm}
  socket.emit('save-position', update_conf)
}

function saveNewPosition(e, i){
  var p = e.parentElement

  var c = e.parentElement.childNodes;
  var posname = c[0].value;
  var posid = c[1].value;
  var posmax = c[2].value;

  var parentcont = e.parentElement;
  var tit_text = document.createElement('DIV');
  var tit_max = document.createElement('DIV');
  var tit_add = document.createElement('BUTTON');
  var tit_edit = document.createElement('BUTTON');

  tit_text.id = posid+"_txt";

  tit_add.className = "button_add";
  tit_edit.className = "button_edit";

  tit_add.setAttribute('onclick', 'addPosition('+i+')');
  tit_edit.setAttribute('onclick', 'editPosition("'+posid+'", '+posmax+', '+i+')');

  tit_text.innerHTML = posname
  tit_max.innerHTML = '(Max votes: '+posmax+')'
  tit_add.innerHTML = 'Add a position after this'
  tit_edit.innerHTML = 'Edit this position'

  p.id = posid + "_tit"
  p.innerHTML = ''
  p.appendChild(tit_text);
  p.appendChild(tit_max);
  p.appendChild(tit_add);
  p.appendChild(tit_edit);

  pp = p.parentElement;
  // add add candidate button
  var can_add = document.createElement('BUTTON');
  can_add.id = posid;
  can_add.className = 'button_add';
  can_add.setAttribute('onclick', 'addCandidate(this)');
  can_add.innerHTML = "Add a candidate"

  pp.id = posid
  pp.appendChild(can_add)

  var update_conf = {addAfter: i, position_name: posname, position_id: posid, max_votes: posmax}
  socket.emit('save-position-new', update_conf)
}

function deleteCandidate(cand_id){
  if (confirm("Are you sure you want to delete this candidate?")){
    socket.emit('delete-candidate', cand_id);
    document.getElementById(cand_id).remove();
    document.getElementById(cand_id+"_cnt").remove();
  }
}

function deletePosition(pos_id, e){
  if (confirm("Are you sure you want to delete this position?")){
    socket.emit('delete-position', pos_id);
    e.parentElement.parentElement.remove()
  }
}

function addCandidate(e){
  var pos_id = e.id;
  var parentPosition = document.getElementById(pos_id);
    // Text fields:
    var poscon = document.createElement("DIV");
    poscon.className = "container_candidate_name";
    poscon.id = pos_id+"_cont";

    var foo = document.createElement("INPUT");
    foo.setAttribute("type", "text");
    foo.setAttribute("value", "New Candidate");
    foo.id = pos_id+"_new";

    var fooid = document.createElement("INPUT");
    fooid.setAttribute("type", "text");
    fooid.setAttribute("value", "N-CN");
    fooid.id = pos_id+"_new_id";

    var bar = document.createElement("BUTTON");
    bar.innerHTML = "Save";
    bar.setAttribute("onclick", "saveNewCandidate('"+pos_id+"', this)");
    bar.className = "button_add";

    var bardel = document.createElement("BUTTON");
    bardel.innerHTML = "Cancel";
    bardel.setAttribute("onclick", "cancelCandidate('"+pos_id+"')");
    bardel.className = "button_delete";

    poscon.appendChild(foo);
    poscon.appendChild(fooid);
    poscon.appendChild(bar);
    poscon.appendChild(bardel);

  parentPosition.insertBefore(poscon, parentPosition.childNodes[parentPosition.childNodes.length - 1]);
}

function addPosition(i){
  var container_master = document.getElementById('b_master');

  // create a new div for a new position
  var container_position = document.createElement('DIV');
  container_position.id = 'newPos';
  container_position.className = 'container_positions';

  var container_title = document.createElement('DIV');
  container_title.className = "container_positions_title";
  container_title.id = 'newPos_tit'

  var foo = document.createElement("INPUT");
  foo.setAttribute("type", "text");
  foo.setAttribute("value", "New Position");
  foo.id = "newPos_posname";

  var fooid = document.createElement("INPUT");
  fooid.setAttribute("type", "text");
  fooid.setAttribute("value", "NPS");
  fooid.id = "newPos_posid";

  var bar = document.createElement("INPUT");
  bar.setAttribute("type", "text");
  bar.setAttribute("value", "1");
  bar.id = "newPos_posmax";

  var car = document.createElement("BUTTON");
  car.innerHTML = "Save"
  car.setAttribute("onclick", "saveNewPosition(this, "+(i+1)+")");
  car.className = "button_add"

  var carlos = document.createElement("BUTTON");
  carlos.innerHTML = "Cancel"
  carlos.setAttribute("onclick", "cancelPosition(this)");
  carlos.className = "button_delete"

  container_title.appendChild(foo);
  container_title.appendChild(fooid);
  container_title.appendChild(bar);
  container_title.appendChild(car);
  container_title.appendChild(carlos);

  container_position.appendChild(container_title)

  console.log(container_master.childNodes[i+2])
  if(i == 9999){
    container_master.insertBefore(container_position, container_master.childNodes[0])
  }else{
    container_master.insertBefore(container_position, container_master.childNodes[i+2])
  }
}

function cancelCandidate(position_id){
  document.getElementById(position_id+"_cont").remove();
}

socket.on('callback-load-data', function(data){
  main(data);
});
socket.on('callback-vote-count', function(data){
  constructVoteCount(data);
});

function cancelPosition(e){
  e.parentElement.remove();
}

function changePassword(){
  newPass = prompt("Please enter new password.")
  if(newPass == prompt("Please confirm your new password.")){
    if(g_config.admin_password == sha256(prompt("Please enter original administrator password."))){
      saveValue('admin_password', sha256(newPass));
    }else{
      alert("Wrong password.")
    }
  }else{
    alert("Passwords do not match up.")
  }
}

function resetVotes(){
  var auth = prompt("Are you sure you want to do this? Please enter administrator password.", "");
  if (sha256(auth)!=g_config.admin_password){
    window.alert("Access is denied.")
    return;
  }

  socket.emit('reset-votes')
}
