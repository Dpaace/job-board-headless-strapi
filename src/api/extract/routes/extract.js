'use strict';
/**
 * extract router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::extract.extract', {
    only: ['find', 'create'],
    config: {
        find: {
            auth: false,
            policies: [],
            middlewares: [],
        }
    }
});
