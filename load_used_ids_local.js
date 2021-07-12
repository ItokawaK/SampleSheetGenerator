var used_ids = {};
var data = [];

String.prototype.trim_N = function()
    {
        return String(this).replace(/-N\d$/g, '');
    };

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  var csv_format = new RegExp('([^\s]+(\\.csv)$)', 'i');

  // files is a FileList of File objects. List some properties.
  var output = [];
  var omitted_files = [];
  for (var i = 0, f; f = files[i]; i++) {
    if (csv_format.test(f.name)){
      let reader = new FileReader();
      reader.fileName = f.name;
      reader.onload = function() {
        data.push(reader.result);
        used_ids = convertCSVtoHash(reader.result, reader.fileName, used_ids);
      }
      reader.readAsText(f)
    }else{
      omitted_files.push(f.name)
      console.log('Omitted: ' + f.name)
    }

  }
  if(omitted_files.length > 0){
    window.alert('Warning: Those non-CSV file(s) were ignored.\n\n' + omitted_files.join('\n'))
  }

  // for(let i=0; i<data.length;i++){
  //   used_ids = convertCSVtoHash(data[i], used_ids);
  // }

}
document.getElementById('files').addEventListener('change', handleFileSelect, false);

function convertCSVtoHash(str, file_name, in_hash){
  // console.log(file_name)
  // var str = req.responseText;
  var lines = str.split(/\r?\r?\n/);
  // console.log(lines)
  var sample_line = false;
  for(var i=0; i<lines.length; i++){
    tmp = lines[i];

    if(tmp.startsWith('[Data]') || tmp.startsWith('[BCLConvert_Data]') ){
      sample_line = true;
      i++;
    }else if(sample_line){
      in_hash[tmp.split(',')[0].trim_N()] = file_name;
    }
  }

  // console.log(result)
  return in_hash
}

// function OnButtonClick2() {
//             for(let i=0; i<data.length;i++){
//               used_ids = convertCSVtoHash(data[i], used_ids);
//             }
//           }

const USED_IDS = used_ids
