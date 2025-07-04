'use strict';

/**
 * water-quality service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::water-quality.water-quality');
