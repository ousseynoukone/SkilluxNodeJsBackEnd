
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
    if (op.insert && (op.insert.image || op.insert.video)) {
      const mediaType = op.insert.image ? 'image' : 'video';
      if (pathIndex < mediaPathList.length) {
        const {insert, attributes } = op;

        const newOp = { insert: { [mediaType]: mediaPathList[pathIndex]}, attributes };
        newOperations.push(newOp);
        pathIndex++;
      

      } else {
        newOperations.push(op);
      }
    } else {
      newOperations.push(op);
    }
  }


  const jsonToString = DocumentConverter.convertToJsonString(newOperations);
  return jsonToString;
}

/**
 * Extracts a list of image and video URLs from a Delta document content into a single array.
 * @param {string} content - The JSON string of the Delta document.
 * @returns {string[]} - An array of media URLs (both images and videos).
 */
function extractMediaUrlsFromDocument(content) {
  const document = DocumentConverter.convertToDocument(content);
  const mediaUrls = [];

  document.ops.forEach(op => {
    if (op.insert) {
      if (op.insert.image) {
        mediaUrls.push(op.insert.image);
      }
      if (op.insert.video) {
        mediaUrls.push(op.insert.video);
      }
    }
  });

  return mediaUrls;
}

const {getServerHostNameOrIp} = require('../auth/helper');

function getMediaLink(file){
  if(file != undefined){
    return  `${getServerHostNameOrIp()}${file.path}`;
  }else{
    throw new Error("file undefined");

  }
}



module.exports = {getStringThatAreInAAndNotInB,getStringThatAreInAAndInB,insertMediasIntoDocument,getMediaLink,extractMediaUrlsFromDocument}