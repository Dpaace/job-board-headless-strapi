const path = require('path');
const fs = require('fs');

module.exports = {
  async extract(ctx) {
    try {
      // Get the URL of the uploaded zip file from the request
      const { zipFileUrl } = ctx.request.body;

      // Define paths
      const zipFilePath = path.join(__dirname, '../../../../public', zipFileUrl);
      const extractTo = path.join(__dirname, '../../../../public/uploads/extracted');

      // Debug logs
      console.log('zipFilePath:', zipFilePath);
      console.log('extractTo:', extractTo);
      if (!fs.existsSync(zipFilePath)) {
        throw new Error('Zip file does not exist at the specified path.');
      }

      // Use the service to extract the zip file
      const extractedFiles = await strapi.service('api::gemello-news.extract-zip').extractZip(zipFilePath, extractTo);

      // Send response with the list of extracted files
      ctx.send({
        message: 'Zip file extracted successfully',
        extractedFiles,
      });
    } catch (error) {
      console.error('Error extracting zip file:', error); // Improved error logging
      ctx.throw(500, 'Failed to extract zip file');
    }
  },
};
