'use strict';

/**
 * air-quality service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::air-quality.air-quality');
