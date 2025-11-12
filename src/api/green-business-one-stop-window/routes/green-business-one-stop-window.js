'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::green-business-one-stop-window.green-business-one-stop-window', {
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
