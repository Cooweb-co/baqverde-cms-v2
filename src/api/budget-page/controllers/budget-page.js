'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::budget-page.budget-page', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        budgets: {
          populate: {
            pdf_file: true
          }
        }
      }
    };

    return await super.find(ctx);
  }
}));
