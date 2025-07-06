'use strict';

/**
 * financial-report service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::financial-report.financial-report');
