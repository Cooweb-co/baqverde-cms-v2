'use strict';

/**
 * climate-change service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::climate-change.climate-change');
