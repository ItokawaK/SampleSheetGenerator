const ROW_NAMES = "ABCDEFGH".split('');
const COL_NAMES = ["01","02","03","04","05","06","07","08","09","10","11","12"];
let date = new Date();
function pad(n){return n<10 ? '0'+n : n}
const TODAY_DATE_STRING = date.getFullYear()+"-"+pad(date.getMonth()+1)+"-"+pad(date.getDate());
const BASE_CALLER_CONFIG = {
  "bcl2fastq":{
    "fileFormat":"v1",
    "revCompI5": false,
    "headerElements":["Sample_ID","Sample_Name","Description","Index_Plate_Well","index","I7_Index_ID", "index2","I5_Index_ID","Sample_Project"]
  },
  "Dragen":{
    "fileFormat":"v2",
    "revCompI5": true,
    "headerElements":["Sample_ID", "index","index2"]
  },
  "iSeq":{
    "fileFormat":"v1_lrm",
    "revCompI5": true,
    "headerElements":["Sample_ID","Description","Index_Plate_Well","I7_Index_ID","index", "I5_Index_ID","index2"]
  }
}

// const BCLConvert_VERSION = "3.7.4";

function generateHeader(version, runName, readLength1, readLength2,
                        indexLength1, indexLength2, trimTarget1, trimTarget2,
                        kit=""){

  if (version == "v1") {
    let headerLines = [
          "[Header]",
          "Experiment Name," + runName,
          "Date," + TODAY_DATE_STRING,
          "Workflow,GenerateFASTQ",
          "",
          "[Reads]",
          readLength1,
          readLength2,
          "",
          "[Settings]",
          "Adapter," + trimTarget1,
          "AdapterRead2," + trimTarget2,
          "",
          "[Data]",
          "Sample_ID,Sample_Name,Description,Index_Plate_Well,index,I7_Index_ID,index2,I5_Index_ID,Sample_Project"
                       ]
    return headerLines;
  }

  if (version == "v2") {

    let headerLines = [
          "[Header]",
          "FileFormatVersion,2",
          "RunName,"+runName,
          "Date," + TODAY_DATE_STRING,
          "InstrumentPlatform,NextSeq1k2k",
          "InstrumentType,NextSeq2000",
          "",
          "[Reads]",
          "Read1Cycles," + readLength1,
          "Read2Cycles," + readLength2,
          "Index1Cycles," +  indexLength1,
          "Index2Cycles," +  indexLength2,
          "",
          "[BCLConvert_Settings]",
          "SoftwareVersion," + BCLConvert_VERSION.value,
          "AdapterRead1," + trimTarget1,
          "AdapterRead2," + trimTarget2,
          "BarcodeMismatchesIndex1,0",
          "BarcodeMismatchesIndex2,0",
          "",
          "[BCLConvert_Data]",
          "Sample_ID,index,index2"
                       ]
    return headerLines;
  }

  if (version == "v1_lrm") {
    if (kit == "truSeqHT") {
      kitName = "TruSeq DNA-RNA CD Indexes 96 Indexes"
    } else {
      kitName = "Custom"
      // window.alert("This kit is not supported, yet! Choose Custom on LRM.")
      // throw new Error('\(^o^)/ owatta')
    }
    let headerLines = [
          "[Header]",
          "Experiment Name," + runName,
          "Date," + TODAY_DATE_STRING,
          "Module,GenerateFASTQ - 2.0.0",
          "Workflow,GenerateFASTQ",
          "Library Prep Kit," + kitName,
          "Chemistry,Amplicon",
          "",
          "[Reads]",
          readLength1,
          readLength2,
          "",
          "[Settings]",
          "Adapter," + trimTarget1,
          "AdapterRead2," + trimTarget2,
          "",
          "[Data]",
          "Sample_ID,Description,Index_Plate_Well,I7_Index_ID,index,I5_Index_ID,index2"
                       ]
    return headerLines;
  }
};

function checkIDString(idString, allowUnderScore=false){
  let output = {};
  if (allowUnderScore) {
    var regex = new RegExp(/^[a-zA-Z0-9-_]+$/);
  }else{
    var regex = new RegExp(/^[a-zA-Z0-9-]+$/);
  }
  if(idString.length <=100){
    output['length'] = true;
  } else {
    output['length'] = false;
  }
  if (regex.test(idString)) {
    output['character'] = true;
  } else {
    output['character'] = false;
  }
  return output;
}

const INDEX_DATA = {};
