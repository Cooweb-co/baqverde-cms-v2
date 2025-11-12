'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::green-business-one-stop-window.green-business-one-stop-window',
  ({ strapi }) => ({
    async find(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: {
          documents_of_interest: {
            populate: {
              pdf_file: true
            }
          },
          green_business_magazine: {
            populate: {
              pdf_file: true
            }
          },
          contact_person: true
        }
      };

      return await super.find(ctx);
    }
  })
);
