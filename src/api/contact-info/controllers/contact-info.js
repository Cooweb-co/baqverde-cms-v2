'use strict';

/**
 * contact-info controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-info.contact-info', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        photo: true
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        photo: true
      }
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
})); 