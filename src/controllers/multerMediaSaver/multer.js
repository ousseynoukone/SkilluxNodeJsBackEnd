const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class MulterHelper {
  constructor() {
    this.upload = this.initializeUpload();
  }

  getErrorMessage(key, lang) {
    const messages = {
      image: {
        en: 'Please upload a valid image file (png, jpg, jpeg)',
        fr: 'Veuillez télécharger un fichier image valide (png, jpg, jpeg)'
      },
      video: {
        en: 'Please upload a valid video file (mp4, MPEG-4)',
        fr: 'Veuillez télécharger un fichier vidéo valide (mp4, MPEG-4)'
      },
      unsupported: {
        en: 'Unsupported file type',
        fr: 'Type de fichier non supporté'
      },
      imageSize: {
        en: 'Image file size should be less than 5MB',
        fr: 'La taille du fichier image doit être inférieure à 5 Mo'
      },
      videoSize: {
        en: 'Video file size should be less than 50MB',
        fr: 'La taille du fichier vidéo doit être inférieure à 50 Mo'
      }
    };
    return messages[key][lang] || messages[key]['en'];
  }

  initializeUpload() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        let basePath = 'medias/';
        let dest;
        if (file.fieldname === 'coverImage') {
          dest = path.join(basePath, 'images', 'covers');
        } else if (file.mimetype.startsWith('video')) {
          dest = path.join(basePath, 'videos');
        } else if(file.fieldname === 'profilePicture') {
          dest = path.join(basePath, 'images', 'profilePictures');
        } else {
          dest = path.join(basePath, 'images', 'contents');
        }

        // Create the directory if it doesn't exist
        fs.mkdir(dest, { recursive: true }, (err) => {
          if (err) {
            return cb(err, null);
          }
          cb(null, dest);
        });
      },
      filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
      }
    });

    return multer({
      storage: storage,
      limits: {
        fileSize: 50000000 // Default to 50MB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          if (!file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/)) {
            return cb(new multer.MulterError('LIMIT_FILE_TYPES', this.getErrorMessage('image', req.user.lang)));
          }
          if (file.size > 5000000) { // 5MB limit for images
            return cb(new multer.MulterError('LIMIT_FILE_SIZE', this.getErrorMessage('imageSize', req.user.lang)));
          }
        } else if (file.mimetype.startsWith('video')) {
          if (!file.originalname.match(/\.(mp4|MPEG-4)$/)) {
            return cb(new multer.MulterError('LIMIT_FILE_TYPES', this.getErrorMessage('video', req.user.lang)));
          }
          if (file.size > 50000000) { // 50MB limit for videos
            return cb(new multer.MulterError('LIMIT_FILE_SIZE', this.getErrorMessage('videoSize', req.user.lang)));
          }
        } else {
          return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', this.getErrorMessage('unsupported', req.user.lang)));
        }
        cb(null, true);
      }
    });
  }
}

module.exports = new MulterHelper();