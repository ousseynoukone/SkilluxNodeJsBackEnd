
// Return strings that are in arrayOfStringA and not in arrayOfStringB
function getStringThatAreInAAndNotInB(arrayOfStringA,arrayOfStringB) {
    return arrayOfStringA.filter(str => !arrayOfStringB.includes(str));
}


// Return strings that are in arrayOfStringA and  in arrayOfStringB
function getStringThatAreInAAndInB(arrayOfStringA,arrayOfStringB) {
    return arrayOfStringA.filter(str => arrayOfStringB.includes(str));
}



const Delta = require('quill-delta');

class DocumentConverter {
  static convertToDocument(content) {
    return new Delta(JSON.parse(content));
  }

  static convertToJsonString(document) {
    return JSON.stringify(document);
  }
}

async function insertMediasIntoDocument(content, mediaPathList) {

  const document = DocumentConverter.convertToDocument(content) || new Delta();
  const delta = new Delta(document);
  const list = delta.ops;
  const newOperations = [];
  let pathIndex = 0;

  for (const op of list) {
    if (op.insert && typeof op.insert === 'object' && (op.insert.image || op.insert.video)) {
      const mediaType = op.insert.image ? 'image' : 'video';
      if (pathIndex < mediaPathList.length) {
       
        const newOp = { insert: { [mediaType]: mediaPathList[pathIndex]} };
        newOperations.push(newOp);
        pathIndex++;
      

      } else {
        newOperations.push(op);
      }
    } else {
      newOperations.push(op);
    }
  }

  // Create a new delta with updated operations
  const newDelta = new Delta(newOperations);
  const newDocument = newDelta; // Assuming document and delta are interchangeable in your case
  const jsonToString = DocumentConverter.convertToJsonString(newDocument);

  return jsonToString;
}

const PORT = process.env.PORT 
const {getServerIP} = require('../auth/helper');

function getMediaLink(file){
  if(file != undefined){
    return "http://"+getServerIP()+":"+PORT+"/"+file.path

  }else{
    return "null";
  }
}



module.exports = {getStringThatAreInAAndNotInB,getStringThatAreInAAndInB,insertMediasIntoDocument,getMediaLink}