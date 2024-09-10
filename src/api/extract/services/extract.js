// 'use strict';

// /**
//  * extract service
//  */

// const { createCoreService } = require('@strapi/strapi').factories;

// module.exports = createCoreService('api::extract.extract');



'use strict';

/**
 * extract service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::extract.extract', {
    async customUpload(files) {
        const customUploadService = strapi.service('api::custom-upload.custom-upload');
        return customUploadService.upload(files);
    },
});