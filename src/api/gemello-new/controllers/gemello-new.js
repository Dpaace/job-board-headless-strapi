// 'use strict';

// /**
//  * gemello-new controller
//  */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::gemello-new.gemello-new');


'use strict';

/**
 * gemello-new controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

module.exports = createCoreController('api::gemello-new.gemello-new', ({ strapi }) => ({
    async extractAssets(ctx) {
        const { id } = ctx.params; // Assuming you pass the resource id

        // Fetch the entity to get the assetbundle
        const entity = await strapi.entityService.findOne('api::gemello-new.gemello-new', id, {
            populate: ['assetbundle'],
        });

        if (entity && entity.assetbundle) {
            const zipFilePath = path.join(strapi.config.appPath, 'public', entity.assetbundle.data[0].attributes.url);
            const outputDir = path.join(strapi.config.appPath, 'public', 'extracted', `assets_${id}`);

            // Create output directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Extract ZIP file
            const zip = AdmZip(zipFilePath);
            zip.extractAllTo(outputDir, true);

            // List extracted files
            const extractedFiles = fs.readdirSync(outputDir).map(fileName => path.join('extracted', `assets_${id}`, fileName));

            ctx.send({
                message: "Files extracted successfully!",
                files: extractedFiles,
            });
        } else {
            ctx.throw(404, 'Asset not found');
        }
    }
}));