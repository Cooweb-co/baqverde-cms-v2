'use strict';

/**
 * plan controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::plan.plan', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        file: true
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        file: true
      }
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  },

  async findByCategory(ctx) {
    const { category } = ctx.params;
    
    ctx.query = {
      ...ctx.query,
      filters: {
        category: {
          $eq: category
        }
      },
      populate: {
        file: true
      },
      sort: ['year:desc', 'createdAt:desc']
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findByYear(ctx) {
    const { year } = ctx.params;
    
    ctx.query = {
      ...ctx.query,
      filters: {
        year: {
          $eq: parseInt(year)
        }
      },
      populate: {
        file: true
      },
      sort: ['category:asc', 'createdAt:desc']
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  }
})); 