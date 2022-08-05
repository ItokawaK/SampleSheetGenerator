const RUN_NAME = document.getElementById('runName');
const KIT_SELECTOR = document.getElementById('kitSelect');
const SLECT_KIT_MSG = document.getElementById('selectKitMsg');
const SHEET_FORMAT = document.getElementById("selectFormat");
const INDEX_EXTENTION = document.getElementById("indexExtention");
const REVCOMP_I5 = document.getElementById("I5Revcomp");
const INPUT_FORM = document.getElementById('inputForm');
const OUTPUT_FORM = document.getElementById('output');
const Log_OUTPUT_FORM = document.getElementById('logoutput');
const DL_LINK = document.getElementById('DL');
const READ_CYCLE_BOXES = [document.getElementById('read1CycleNumber'), document.getElementById('read2CycleNumber')];
// const INDEX_CYCLE_BOXES = [document.getElementById('index1CycleNumber'), document.getElementById('index2CycleNumber')];
const INPUT_PLACEHOLDER = "Copy & paste sampleID table here directly from Excel spreadsheet. " +
                          "Plese always start copying from A01 cell regardless " +
                          "of whether there is a value or not.";

const CELL_COLOR_EMPTY = "white";
const CELL_COLOR_ERROR = "#C0392B";
const CELL_COLOR_VALID = "#27AE60";
const SELECT_YOUR_KIT_MSG = "&#8678 Select your kit first!";

const INPUT_TEXTAREA_CLASS = "inputTextarea";
const SAMPLE_TABLE_CLASS = "sampleTable";
const SAMPLE_CELL_CLASS = "sampleTableCell";
const SAMPLE_HEADER_CELL_CLASS = "sampleTableCellHeader";
const SAMPLE_ID_CELL_CLASS = "sampleTableCellId";
const INPUT_FORMBOX_CLASS = "inputFormBox";
const INDEX_PLATENAME_CLASS = "indexPlateName";

const LANGUAGE_OP = document.getElementById('selectLang');
const EXPLANATION_CLASSES = document.getElementsByClassName('Explanation');
const ALLOW_UNDESCORE_CBX = document.getElementById('allowUnderScore');

var format_atleast_once = false;

const DOWNLOAD_FILE = 'SampleSheet.csv';
const DELIMITTER = /\t|,\s*/;

// const BCLConvert_VERSION = "3.7.4";
const BCLConvert_VERSION = document.getElementById('DragenVersion');

LANGUAGE_OP.addEventListener("change",
                      (event)=>{
                        let all = EXPLANATION_CLASSES;
                        for (var i = 0; i < all.length; i++) {
                          all[i].style.display = "none";
                        };

                        if (document.getElementById('lang-Jp').checked){
                          document.getElementById('ExplanationJp')
                             .style.display = "inline";
                        } else {
                          document.getElementById('ExplanationEng')
                              .style.display = 'inline';
                        }
                      }
                    );

SLECT_KIT_MSG.innerHTML = SELECT_YOUR_KIT_MSG;

RUN_NAME.value = "MyExperiment-"+TODAY_DATE_STRING;
RUN_NAME.addEventListener("change",
                       (event)=>{if (OUTPUT_FORM.value) {formating()}}
                            );

// Add library kit options on selectBox
for (const [key, value] of Object.entries(INDEX_DATA)) {
  let option = document.createElement('option');
  option.setAttribute('value', key);
  option.setAttribute('class', 'options2');
  option.innerHTML = value.kitName;
  KIT_SELECTOR.appendChild(option);
}


// Add event listner on kit selecter
KIT_SELECTOR.addEventListener("change",generateInbox);
// KIT_SELECTOR.addEventListener("change",OnButtonClick2);

SHEET_FORMAT.addEventListener("change",
                       (event)=>{
                         if (SHEET_FORMAT.baseCaller.value == 'Dragen'){
                            document.getElementById('DragenVersionSelecter').style.visibility = 'visible'
                         } else {
                           document.getElementById('DragenVersionSelecter').style.visibility = 'hidden'
                         };
                         if (OUTPUT_FORM.value) {formating();}
                      });
INDEX_EXTENTION.addEventListener("change",
                       (event)=>{if (OUTPUT_FORM.value) {formating()}}
                            );
REVCOMP_I5.addEventListener("change",
                       (event)=>{if (OUTPUT_FORM.value) {formating()}}
                            );
READ_CYCLE_BOXES[0].addEventListener("change",
                       (event)=>{if (OUTPUT_FORM.value) {formating()}}
                            );
READ_CYCLE_BOXES[1].addEventListener("change",
                       (event)=>{if (OUTPUT_FORM.value) {formating()}}
                            );
ALLOW_UNDESCORE_CBX.addEventListener("change",
                       (event)=>{if (format_atleast_once) {formating()}}
                            );
BCLConvert_VERSION.addEventListener("change",
                       (event)=>{if (OUTPUT_FORM.value) {formating()}}
                            );
// INDEX_CYCLE_BOXES[0].addEventListener("change",
//                        (event)=>{if (OUTPUT_FORM.value) {formating()}}
//                             );
// INDEX_CYCLE_BOXES[1].addEventListener("change",
//                        (event)=>{if (OUTPUT_FORM.value) {formating()}}
//                             );

// function to remove current input textarea
function removeFormats(target){
  for (let i=target.childNodes.length-1;i>=0; i--){
    target.removeChild(target.childNodes[i]);
  }
};

// function to return reverse complement seq
function revCompDNA(dnaSeq){
  let compDict = {"A":"T","T":"A","G":"C","C":"G"};
  let tmp = [];
  let rcDnaSeq;

  for (let base of dnaSeq.split('')) {tmp.push(compDict[base])};
  tmp.reverse();
  rcDnaSeq = tmp.join('');
  return rcDnaSeq;
}

function generateInbox(){

   removeFormats(INPUT_FORM);

   let kit = KIT_SELECTOR.value;
   let baseCaller = SHEET_FORMAT.baseCaller.value;

   let indexExt = INDEX_EXTENTION.indexExt.value;

   OUTPUT_FORM.value = "";
   DL_LINK.removeAttribute("href");
   DL_LINK.removeAttribute('download');

   // return an empty textarea
   function createInputArea(id){
     let ta = document.createElement("textarea");
     ta.id = id;
     ta.className = INPUT_TEXTAREA_CLASS;
     ta.placeholder = INPUT_PLACEHOLDER;
     // ta.addEventListener("change", (event)=>{formating()});
     ta.addEventListener("change", formating);

     return ta
   };

   // return an empty table
   function createEmptyTable(id){
     let tbl = document.createElement( 'table' );
     tbl.id = id
     tbl.className = SAMPLE_TABLE_CLASS;
     let tmp_row;
     let tmp_cell;
     for (let i=0; i<9; i++){
       tmp_row = tbl.insertRow(-1);
       for (let ii=0; ii<13; ii++){
         tmp_cell = tmp_row.insertCell( -1 );
         tmp_cell.className = SAMPLE_CELL_CLASS;

         if( i == 0 && ii == 0){
           tmp_cell.classList.add(SAMPLE_HEADER_CELL_CLASS)
         }else if (i == 0){
           tmp_cell.classList.add(SAMPLE_HEADER_CELL_CLASS);
           tmp_cell.innerHTML = COL_NAMES[ii-1];
         }else if (ii == 0){
           tmp_cell.classList.add(SAMPLE_HEADER_CELL_CLASS);
           tmp_cell.innerHTML = ROW_NAMES[i-1];
         }else{
           tmp_cell.classList.add(SAMPLE_ID_CELL_CLASS)
           tmp_cell.innerHTML = '';
         }
       }
     }
     return tbl;
   };

   // start creating a field for input
   let textareaAndTbl;
   let p0;
   let p1;
   let plateName;

   if (kit) {

     SLECT_KIT_MSG.innerHTML = "";

     let IndexSetNames = INDEX_DATA[kit].indexSetNames;

     READ_CYCLE_BOXES[0].value = INDEX_DATA[kit].defaultReadLength;
     READ_CYCLE_BOXES[1].value = INDEX_DATA[kit].defaultReadLength;
     // INDEX_CYCLE_BOXES[0].value = INDEX_DATA[kit].indexLength;
     // INDEX_CYCLE_BOXES[1].value = INDEX_DATA[kit].indexLength;

     for (let i=0; i<IndexSetNames.length; i++){
       textareaAndTbl = document.createElement("div");
       textareaAndTbl.className = INPUT_FORMBOX_CLASS;
       textareaAndTbl.id = 'inputArea' + i;

       p0 = document.createElement("p");
       plateName = document.createTextNode(IndexSetNames[i] + ":");
       p0.appendChild(plateName);
       p0.className = INDEX_PLATENAME_CLASS;

       p1 = document.createElement("p");
       p1.appendChild(createInputArea('inputBox'+i));

       textareaAndTbl.appendChild(p0);
       textareaAndTbl.appendChild(p1);
       textareaAndTbl.appendChild(createEmptyTable('table'+i));

       INPUT_FORM.appendChild(textareaAndTbl);
    }
  } else {
    SLECT_KIT_MSG.innerHTML = SELECT_YOUR_KIT_MSG;
  }
}

function formating(){
  format_atleast_once = true;
  if(Object.keys(USED_IDS).length == 0){
    let err_msg = 'Warning: No previous run data was loaded.\n';
    window.confirm(err_msg);
    Log_OUTPUT_FORM.value += err_msg;
  }

  Log_OUTPUT_FORM.value += '\n---------Start Formatting------------\n\n'

  OUTPUT_FORM.value = "";

  // Run Meta Data
  let kit = KIT_SELECTOR.value;
  let baseCaller = SHEET_FORMAT.baseCaller.value;
  let indexExt = parseInt(INDEX_EXTENTION.indexExt.value);
  let baseCallerConfig = BASE_CALLER_CONFIG[baseCaller];
  let indexSet = INDEX_DATA[kit];
  let numPlate = indexSet.indexSetNames.length;
  let readLength1 = READ_CYCLE_BOXES[0].value;
  let readLength2 = READ_CYCLE_BOXES[1].value;
  let indexLength1 = indexSet.indexLength;
  let indexLength2 = indexSet.indexLength;
  indexLength1 += indexExt;
  indexLength2 += indexExt;
  let adapterExt1 = indexSet.adapterExtra1
  let adapterExt2 = indexSet.adapterExtra2
  let trimTarget1 = indexSet.trimTarget1;
  let trimTarget2 = indexSet.trimTarget2;
  let make_i5_revcomp = REVCOMP_I5.i5_revcomp.value;
  let allowUnderScore = ALLOW_UNDESCORE_CBX.checked;

  let outLines = [];  // an array to store sample sheet lines
  let usedSampleId = []  // an array to store used sample IDs

  for (let plate=0; plate < numPlate; plate++){
    let input_lines = []; // table deliminted by newline
    let lines_delimited = []; // nested table delimited by tab

    let sourcePlateID = 'inputBox'+ plate;

    let indexSet2 = indexSet.indexSeq[plate].i5;
    let indexSet1 = indexSet.indexSeq[plate].i7;

    let in_tbl = document.getElementById(sourcePlateID).value;

    in_tbl.split('\n').forEach(
      x => input_lines.push(x)
    );
    input_lines.forEach(
      x => lines_delimited.push(x.split(DELIMITTER))
    );

    let num_row = lines_delimited.length;
    if (num_row > 8){
      num_row = 8
    };

    let tbl = document.getElementById('table' + plate);

    // Erase all values in table
    for (let i=0; i<8; i++){
      for (let ii=0; ii<12; ii++){
        let tblCell = tbl.rows[i+1].cells[ii+1];
        tblCell.innerHTML = "";
        tblCell.style.backgroundColor = CELL_COLOR_EMPTY;
      }
    }

    for (let row=0; row < num_row; row++){
      let num_col = lines_delimited[row].length;
      if (num_col > 12){
        let err_msg = `Error: There are too many columns (>12).\n`;
        Log_OUTPUT_FORM.value += err_msg;
        window.alert(err_msg);
        num_col = 12
      }

      for (let col=0; col < num_col; col++){
        let sortNo = 96*plate + 8*col + row + 1;
        let sampleId = lines_delimited[row][col];
        if (sampleId){

          let wellName = ROW_NAMES[row] + COL_NAMES[col];
          let index1 = indexSet1[row][col] + adapterExt1;
          let index2 = indexSet2[row][col] + adapterExt2;

          index1 = index1.substr(0, indexLength1);
          index2 = index2.substr(0, indexLength2);

          if (baseCallerConfig.revCompI5) {index2 = revCompDNA(index2)};
          if(make_i5_revcomp=='true') {index2 = revCompDNA(index2)}

          let index1Name = "";
          let index2Name = "";
          if (indexSet.IndexNamingRule){
             index1Name = indexSet.IndexNamingRule.i7(plate, row, col);
             index2Name = indexSet.IndexNamingRule.i5(plate, row, col);
           }

          //Sample_ID,Sample_Name,Description,Index_Plate_Well,index,I7_Index_ID,index2,I5_Index_ID,Sample_Project
          let outLine = {
            "Sample_ID":sampleId,
            "Sample_Name":sampleId,
            "Description":"",
            "Index_Plate_Well":wellName,
            "index":index1,
            "I7_Index_ID":index1Name,
            "index2":index2,
            "I5_Index_ID":index2Name,
            "Sample_Project": "FASTQGZ-Reads",
            "sort_order": sortNo

          }// [sampleId, sampleId, '', wellName, index1,index1Name, index2,index2Name, "FASTQGZ-Reads"];

          outLines.push(outLine);

          // rewrite table

          let tblCell = tbl.rows[row+1].cells[col+1];

          let sampleIdShort;
          if (sampleId.length > 12){
            sampleIdShort = sampleId.substr(0,10) + '...'
          }else{
            sampleIdShort = sampleId
          }
          tblCell.innerHTML = sampleIdShort;

          let idSanity = checkIDString(sampleId, allowUnderScore);
          if (!idSanity['length']){
            let err_msg = `Error: ${sampleId} has too many characters.\n`;
            window.alert(err_msg);
            Log_OUTPUT_FORM.value += err_msg;
            tblCell.style.backgroundColor = CELL_COLOR_ERROR;
            return 1;
          }
          if (!idSanity['character']){
            let err_msg = `Error: ${sampleId} has an invalid character(s).\n`;
            Log_OUTPUT_FORM.value += err_msg;
            window.alert(err_msg);
            tblCell.style.backgroundColor = CELL_COLOR_ERROR;
            return 1;
          }

          if (usedSampleId.includes(sampleId)){
            let err_msg = `Error: ${sampleId} is duplicated in this run.\n`;
            window.alert(err_msg);
            tblCell.style.backgroundColor = CELL_COLOR_ERROR;
            Log_OUTPUT_FORM.value += err_msg;
            return 1;
          }

          // console.log(sampleId);
          usedSampleId.push(sampleId)

          if (USED_IDS[sampleId.trim_N()]){
            let err_msg = `Warning: ${sampleId} exists in an old run(s) >>> ${USED_IDS[sampleId.trim_N()]}.\n`;
            // window.alert('Warning: ' + sampleId + ' exists in old run.');
            Log_OUTPUT_FORM.value += err_msg;
            tblCell.style.backgroundColor = CELL_COLOR_ERROR;
            // return 1;
          }else{
            tblCell.style.backgroundColor = CELL_COLOR_VALID;
          }


        }
      }
    };
  }

  outLines.sort(function(a, b){return a.sort_order - b.sort_order})
  let outDataStringArray = [];
  for (let el of outLines){
    let tmp = [];
    for (let headerElement of baseCallerConfig.headerElements){
      tmp.push(el[headerElement])
    }
    outDataStringArray.push(tmp.join(","))
  }

  let headerLines = generateHeader(baseCallerConfig.fileFormat,
                                   RUN_NAME.value,
                                   readLength1,
                                   readLength2,
                                   indexLength1,
                                   indexLength2,
                                   trimTarget1,
                                   trimTarget2,
                                   kit=kit
                                 );
  let outArray = headerLines.concat(outDataStringArray);

  OUTPUT_FORM.value = outArray.join('\n');

  let blob = new Blob([outArray.join('\n')], {type:"text/plain"});
  DL_LINK.href = URL.createObjectURL(blob);
  DL_LINK.download = DOWNLOAD_FILE;

  Log_OUTPUT_FORM.value += '\n---------End Formatting------------\n'
};
