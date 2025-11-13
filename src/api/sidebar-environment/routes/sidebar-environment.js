'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sidebar-environment.sidebar-environment', {
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
