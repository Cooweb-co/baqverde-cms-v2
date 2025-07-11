'use strict';

/**
 * main-modal router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::main-modal.main-modal', {
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: []
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: []
    }
  }
}); 