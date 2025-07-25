'use strict';

/**
 * calendar controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::calendar.calendar', ({ strapi }) => ({
  async findByMonthNumber(ctx) {
    const { monthNumber } = ctx.params;
    const entry = await strapi.db.query('api::calendar.calendar').findOne({
      where: { monthNumber: parseInt(monthNumber) },
      populate: ['image']
    });
    return this.transformResponse(entry);
  },

  async findCurrentMonth(ctx) {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const entry = await strapi.db.query('api::calendar.calendar').findOne({
      where: { monthNumber: currentMonth },
      populate: ['image']
    });
    return this.transformResponse(entry);
  }
}));
