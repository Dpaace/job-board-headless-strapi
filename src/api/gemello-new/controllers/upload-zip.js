const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

// Configure Multer
const upload = multer({
  dest: '/tmp/uploads',
  limits: { fileSize: 1024 * 1024 * 1024 }, // 50MB limit
}).single('file'); // Use '.single' with 'file' as the key

module.exports = {
  async uploadAndExtract(ctx) {
    try {
      // Ensure the temporary upload directory exists
      const tmpUploadsPath = path.join(__dirname, '/tmp/uploads');
      if (!fs.existsSync(tmpUploadsPath)) {
        fs.mkdirSync(tmpUploadsPath, { recursive: true });
      }

      // Handle the file upload with Multer
      await new Promise((resolve, reject) => {
        upload(ctx.req, ctx.res, (err) => {
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

      if (path.extname(file.originalname).toLowerCase() !== '.zip') {
        console.error('Invalid file type:', file.originalname);
        return ctx.throw(400, 'Only zip files are allowed');
      }

      // Extract zip file
      const zip = AdmZip(file.path);
      const collectionTypeId = ctx.request.body.collectionTypeId;

      if (!collectionTypeId) {
        console.error('Collection Type ID is missing');
        return ctx.throw(400, 'Collection Type ID is required');
      }

      const extractTo = path.join(__dirname, '../../../../public/uploads', collectionTypeId);

      if (!fs.existsSync(extractTo)) {
        fs.mkdirSync(extractTo, { recursive: true });
      }

      zip.extractAllTo(extractTo, true);

      fs.unlinkSync(file.path); // Clean up the uploaded zip file

      const extractedFiles = fs.readdirSync(extractTo).map((fileName) => ({
        name: fileName,
        url: `/uploads/${collectionTypeId}/${fileName}`,
      }));

      console.log('Extracted files:', extractedFiles);

      ctx.send({
        message: 'File uploaded and extracted successfully',
        extractedFiles,
      });
    } catch (error) {
      console.error('Error in uploadAndExtract controller:', error.message);
      ctx.throw(500, 'Failed to upload and extract zip file');
    }
  },
};
