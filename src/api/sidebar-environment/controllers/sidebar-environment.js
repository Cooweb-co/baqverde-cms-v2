'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::sidebar-environment.sidebar-environment', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      filters: {
        ...(ctx.query?.filters || {}),
        isActive: true
      },
      populate: {
        monthImage: true,
        calendarBackground: true,
        calendarDocument: true
      }
    };

    return await super.find(ctx);
  }
}));
