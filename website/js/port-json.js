
const portSchema = {
  /* Version number of the port.json format, currently 2 */
  "version": 2,
  /* Name of the zip file, this uniquely identifies the port */
  "name": "",
  /* Directories and scripts that comes with the port. */
  "items": [],
  /* Optional scripts / directories associated with the port. */
  "items_opt": [],
  "attr": {
    /* title of the game. */
    "title": "",
    /* who ported this */
    "porter": "",
    /* Description of the game. */
    "desc": "",
    /* Installation instructions */
    "inst": "",
    /* Genres */
    "genres": [],
    /* screenshot/title screen of the game */
    "image": null,
    /* Does the port run without any additional files. */
    "rtr": false,
    /* experimental port flag */
    "exp": false,
    /* What runtime do we require? */
    "runtime": null,
    /* Any hardware/software requirements: opengl, power, 4:3, 3:2, 16:9, lowres, hires */
    "reqs": [],
     /* Architecture aarch64,armhf, x86_64, x86  */
    "arch": [], 
    /* Devices ported to */
    "devices": [],
  }
}

function getJsonTemplate() {
  var copiedTemplate = { ...portSchema };
  return copiedTemplate
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()



async function populatePorterList() {
  var porters = {};
  try {
    var response = await fetch('https://raw.githubusercontent.com/PortsMaster/PortMaster-Info/main/porters.json');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    porters = await response.json();
  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }

  var porterList = document.getElementById("porter")
  for (let x in porters) {
    var option = document.createElement('option');
    option.text = option.value = x;
    porterList.add(option);
  }
}

function addPorter() {
  var porterList = document.getElementById("porter")
  var porters = Array.from(porterList.options).map(e => e.value);
  var newPorter = document.getElementById("addporter");
  if (!porters.includes(newPorter.value) && newPorter.value != "") {
    var option = document.createElement('option');
    option.text = option.value = newPorter.value;
    porterList.add(option, 0);
  }
  newPorter.value = "";
}

function getFormValues() {
  var portJson = getJsonTemplate();
  portJson.attr.title = document.getElementById("title").value;
  portJson.name = document.getElementById("zipname").value;
  portJson.items = document.getElementById("scriptname").value.split(",");
  portJson.items.push(document.getElementById("directoryname").value);
  portJson.attr.genres = Array.from(document.getElementById("genres").selectedOptions).map(o => o.value);
  portJson.attr.porter = Array.from(document.getElementById("porter").selectedOptions).map(o => o.value);
  portJson.attr.desc = document.getElementById("description").value;
  portJson.attr.inst = document.getElementById("instructions").value;
  portJson.attr.runtime = document.getElementById("runtime").value ? document.getElementById("runtime").value : null;
  portJson.attr.rtr = document.getElementById("readytorun").checked;
  portJson.attr.exp = document.getElementById("experimental").checked;
  portJson.attr.reqs = [];

  portJson.attr.arch = [];
  if (document.getElementById("arch").value != ""){
  portJson.attr.arch = Array.from(document.getElementById("arch").selectedOptions).map(o => o.value);
  }

  // res requirements
  if (document.getElementById("notlowres").checked){
    portJson.attr.reqs.push("!lowres");
  }
  if (document.getElementById("hires").checked){
    portJson.attr.reqs.push("hires");
  }

  // ram requirements
  if (document.getElementById("2gb").checked){
    portJson.attr.reqs.push("2gb");
  }
  if (document.getElementById("4gb").checked){
    portJson.attr.reqs.push("4gb");
  }

    // opengl requirement
    if (document.getElementById("opengl").checked){
      portJson.attr.reqs.push("opengl");
    }

  // power requirement
  if (document.getElementById("power").checked){
    portJson.attr.reqs.push("power");
  }

  // devices ported to
  if(document.getElementById("devices").checked){
    portJson.attr.devices = Array.from(document.getElementById("devicess").selectedOptions).map(o => o.value);
  }

  return portJson;
}

function validateForm(){
  form = document.getElementById("form");
  if (form.checkValidity()) {
    downloadJson();
  }

  form.classList.add('was-validated')
}

function downloadJson() {
  var json = JSON.stringify(getFormValues(), null, 2);
  var file = new Blob([json], { type: "application/json" });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "port.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}


populatePorterList();
