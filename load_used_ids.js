
var data_url = 'sample_sheets/';
var data_files = [];
var reqs = [];
var used_ids = {};

function get_file_list(){
  return $.ajax({
    url: data_url,
    success: function(data){
      $(data).find('a').attr(
        'href',
        function(i, val) {
          data_files.push(data_url + val);
        })
    }
  })
}

function reads(){
  for(let i=0; i< data_files.length; i++){
    console.log(i);
    let req = new XMLHttpRequest();
    req.timeout = 1000;
    req.open('get', data_files[i], true);
    req.send();
    req.onload = function(){
      reqs.push([data_files[i], req])
    }
    console.log(req.readyState)
    // while (req.readyState < 3){}
    console.log(req.readyState)
    // reqs.push([data_files[i], req])
  }
}

get_file_list().done(
  function(result){
    console.log('get it!');
    console.log(data_files);
    reads()
  }).fail(function(result){
    console.log('failled!')
  })

function convertCSVtoHash(req, in_hash){
  var str = req.responseText;
  var lines = str.split(/\r?\n/);
  var sample_line = false;
  for(var i=0; i<lines.length; i++){
    tmp = lines[i];

    if(tmp === '[Data]' ){
      sample_line = true;
      i++;
    }else if(sample_line){
      in_hash[tmp.split(',')[0]] = 1
    }
  }

  // console.log(result)
  return in_hash
}

// function OnButtonClick1() {
//   reads()
// }

function OnButtonClick2() {
            target = document.getElementById("output");

            for(let i=0; i<reqs.length;i++){
              used_ids = convertCSVtoHash(reqs[i][1], used_ids);
            }
          }
const USED_IDS = used_ids
