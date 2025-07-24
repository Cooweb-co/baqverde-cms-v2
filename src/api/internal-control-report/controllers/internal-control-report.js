'use strict';

/**
 * internal-control-report controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::internal-control-report.internal-control-report', ({ strapi }) => ({
  async find(ctx) {
    // Add default sort to get reports in descending order (newest first)
    ctx.query = {
      ...ctx.query,
      sort: { year: 'desc', publicationDate: 'desc' },
      populate: {
        document: true
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        document: true
      }
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
}));