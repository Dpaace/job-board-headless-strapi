const path = require('path');
const fs = require('fs');

const multer = require('multer');

// Set up Multer
const upload = multer({
  dest: path.join(__dirname, '../tmp/uploads'),
  limits: { fileSize: 1024 * 1024 * 1024 },
});


module.exports = {
  async uploadFile(ctx) {
    try {
      // Handle the file upload with Multer
      await new Promise((resolve, reject) => {
        upload.single('file')(ctx.req, ctx.res, (err) => {
          if (err) {
            console.error('Multer file upload error:', err);
            return reject(err);
          }
          resolve();
        });
      });

      const file = ctx.req.file;
      if (!file) {
        console.error('No file uploaded');
        return ctx.throw(400, 'No file uploaded');
      }

      console.log('Uploaded file details:', file);

      // Respond with file details
      ctx.send({
        message: 'File uploaded successfully',
        file: {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
        },
      });
    } catch (error) {
      console.error('Error in uploadFile controller:', error.message);
      ctx.throw(500, 'Failed to upload file');
    }
  },
};

