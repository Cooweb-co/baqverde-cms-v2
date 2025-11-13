'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::budget-page.budget-page', {
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
