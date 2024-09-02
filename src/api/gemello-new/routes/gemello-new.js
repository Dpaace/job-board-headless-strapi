'use strict';

/**
 * gemello-new router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::gemello-new.gemello-new');


// , () => ({

//     async create(ctx) {
//         const { data } = ctx.request.body;
//         const files = ctx.requiest.files;

//         const parsedData = JSON.parse(data);
//         const entry = await strapi.entityService.create('api::gemello-new.gemello-new', {
//             data: {
//                 ...parsedData,
//             },
//             files : {
//                 file: files['files.file']
//             }
//         })
//         ctx.send(entry);
//         return entry;
//     }

// })