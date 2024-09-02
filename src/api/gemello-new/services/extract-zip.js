// src/api/gemello-news/services/extract-zip.js

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

module.exports = {
  extractZip: async (zipFilePath, extractTo) => {
    try {
      if (!fs.existsSync(zipFilePath)) {
        throw new Error(`Zip file not found at path: ${zipFilePath}`);
      }

      // Ensure the extraction directory exists
      if (!fs.existsSync(extractTo)) {
        fs.mkdirSync(extractTo, { recursive: true });
      }

      // Read the zip file
      const zip = AdmZip(zipFilePath);

      // Extract all files to the specified directory
      zip.extractAllTo(extractTo, true);

      // Return the list of extracted files
      const extractedFiles = fs.readdirSync(extractTo).map((file) => path.join(extractTo, file));
      return extractedFiles;
    } catch (error) {
      console.error('Error in extractZip service:', error.message);
      throw new Error('Failed to extract zip file');
    }
  },
};
