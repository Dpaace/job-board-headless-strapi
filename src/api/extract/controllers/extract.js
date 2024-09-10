'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

// Function to sanitize filenames
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9\.\-_]/gi, '_'); // Replace invalid characters with underscores
};

module.exports = createCoreController('api::extract.extract', ({ strapi }) => ({
    async find(ctx) {
        ctx.query = { ...ctx.query, locale: "en" };
        const result = await super.find(ctx);
        result.meta.date = Date.now();
        return result;
    },

    async healthCheck(ctx) {
        ctx.body = {
            data: "ok I have reached healthcheck"
        };
    },

    async create(ctx) {
        const { body } = ctx.request.body.data;
        const { files } = ctx.request;

        // Enhanced check for file presence and type 
        if (!files || !files['files.assets']) {
            return ctx.badRequest('No ZIP file uploaded.');
        }

        const zipFile = Array.isArray(files['files.assets'])
            ? files['files.assets'][0]  // If multiple files are sent
            : files['files.assets'];     // Single file upload case

        if (!zipFile || zipFile.type !== 'application/zip') {
            return ctx.badRequest('Only ZIP files are allowed.');
        }

        try {
            const zipFileNameWithoutExt = path.basename(zipFile.name, path.extname(zipFile.name));
            const baseUploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', zipFileNameWithoutExt);
            fs.mkdirSync(baseUploadDir, { recursive: true });

            const zip = AdmZip(zipFile.path);
            const zipEntries = zip.getEntries(); // Get all entries in the zip file

            const extractedFiles = [];

            for (const entry of zipEntries) {
                if (!entry.isDirectory) {
                    const sanitizedFileName = sanitizeFilename(entry.entryName);
                    const tempFilePath = path.join(baseUploadDir, sanitizedFileName);
                    const dirPath = path.dirname(tempFilePath);
                    fs.mkdirSync(dirPath, { recursive: true });
                    fs.writeFileSync(tempFilePath, entry.getData());
                    const fileStat = fs.statSync(tempFilePath);

                    const uploadedFile = await strapi.plugin('upload').service('upload').upload({
                        data: {},
                        files: {
                            path: tempFilePath,
                            name: sanitizedFileName,
                            type: 'application/octet-stream',
                            size: fileStat.size,
                        },
                    });

                    extractedFiles.push(uploadedFile[0].id);
                    fs.unlinkSync(tempFilePath);
                }
            }

            // Debug statement to check the request body
            console.log('Request body data:', ctx.request.body.data);

            const entity = await strapi.service('api::extract.extract').create({
                data: {
                    name: body, // Include any other data from the request body
                    assets: extractedFiles,
                },
            });

            // Debug statement to verify created entity
            console.log('Created entity:', entity);

            return this.transformResponse(entity);
        } catch (error) {
            console.error('Error processing zip file:', error);
            return ctx.badRequest('Error processing zip file.');
        }
    }
}));

// 'use strict';

// const { createCoreController } = require('@strapi/strapi').factories;
// const AdmZip = require('adm-zip');
// const path = require('path');
// const fs = require('fs');

// module.exports = createCoreController('api::extract.extract', ({ strapi }) => ({
//     async find(ctx) {
//         ctx.query = { ...ctx.query, locale: "en" };
//         const result = await super.find(ctx);
//         result.meta.date = Date.now();
//         return result;
//     },

//     async healthCheck(ctx) {
//         ctx.body = {
//             data: "ok I have reached healthcheck"
//         };
//     },

//     async create(ctx) {
//         const { body } = ctx.request.body.data;
//         const { files } = ctx.request;

//         if (!files || !files['files.assets']) {
//             return ctx.badRequest('No ZIP file uploaded.');
//         }

//         const zipFile = Array.isArray(files['files.assets'])
//             ? files['files.assets'][0]
//             : files['files.assets'];

//         if (!zipFile || zipFile.type !== 'application/zip') {
//             return ctx.badRequest('Only ZIP files are allowed.');
//         }

//         try {
//             const zipFileNameWithoutExt = path.basename(zipFile.name, path.extname(zipFile.name));
//             const baseUploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', zipFileNameWithoutExt);
//             fs.mkdirSync(baseUploadDir, { recursive: true });

//             const zip = AdmZip(zipFile.path);
//             const zipEntries = zip.getEntries();
//             const extractedFiles = [];

//             for (const entry of zipEntries) {
//                 if (!entry.isDirectory) {
//                     const originalFileName = entry.entryName; // Use the original name
//                     const tempFilePath = path.join(baseUploadDir, originalFileName);
//                     const dirPath = path.dirname(tempFilePath);
//                     fs.mkdirSync(dirPath, { recursive: true });
//                     fs.writeFileSync(tempFilePath, entry.getData());
//                     const fileStat = fs.statSync(tempFilePath);

//                     // Use the custom upload service
//                     const uploadedFile = await strapi.service('api::extract.extract').customUpload([{
//                         path: tempFilePath,
//                         name: originalFileName,
//                         type: 'application/octet-stream',
//                         size: fileStat.size,
//                     }]);

//                     extractedFiles.push(uploadedFile[0].id);
//                     fs.unlinkSync(tempFilePath);
//                 }
//             }

//             const entity = await strapi.service('api::extract.extract').create({
//                 data: {
//                     name: body,
//                     assets: extractedFiles,
//                 },
//             });

//             return this.transformResponse(entity);
//         } catch (error) {
//             console.error('Error processing zip file:', error);
//             return ctx.badRequest('Error processing zip file.');
//         }
//     }
// }));
