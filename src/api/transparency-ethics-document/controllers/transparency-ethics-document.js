'use strict';

/**
 * transparency-ethics-document controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::transparency-ethics-document.transparency-ethics-document', ({ strapi }) => ({
    async find(ctx) {
      ctx.query = {
        ...ctx.query,
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