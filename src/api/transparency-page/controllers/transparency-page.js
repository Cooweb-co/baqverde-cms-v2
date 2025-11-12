'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transparency-page.transparency-page', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        sections: {
          populate: {
            elements: {
              populate: {
                pdf: true,
                subitems: {
                  populate: {
                    pdf: true
                  }
                }
              }
            }
          }
        }
      }
    };

    return await super.find(ctx);
  }
}));
