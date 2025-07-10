'use strict';

/**
 * green-window controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::green-window.green-window', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        coverImage: true
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        coverImage: true
      }
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
})); 