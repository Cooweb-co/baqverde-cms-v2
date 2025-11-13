'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::citizen-participation.citizen-participation', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        options: {
          populate: {
            image: true,
            document: true
          }
        }
      }
    };

    return await super.find(ctx);
  }
}));
