const fs = require('fs');
const path = require('path');

/**
 * Deletes an image file given its URL, where the local path is contained in the URL.
 * @param {string} imageUrl - The URL of the image to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the image is deleted.
 */
async function deleteLocalImageFromUrl(imageUrl) {
  if (imageUrl) {
    try {
      // Extract the local path from the URL
      const localPath = imageUrl.split('/api/v1/')[1]; 
  
      // Construct the full local file path
      const fullFilePath = path.join(localPath);
  
      // Check if the file exists
      if (fs.existsSync(fullFilePath)) {
        // Delete the file
        fs.unlinkSync(fullFilePath);
        return true;
      } else {
        console.log('Image not found');
        return false;
  
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      
      throw error;
      
    }  
  }else{
    return false;

  }


}


module.exports = deleteLocalImageFromUrl;

