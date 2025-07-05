'use strict';

/**
 * air-quality controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::air-quality.air-quality');
