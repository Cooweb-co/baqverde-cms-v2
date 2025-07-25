'use strict';

/**
 * green-entrepreneur controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::green-entrepreneur.green-entrepreneur', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        logo: true
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        logo: true
      }
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
})); 