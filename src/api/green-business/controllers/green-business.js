'use strict';

/**
 * green-business controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::green-business.green-business', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        image: true
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        image: true
      }
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
})); 