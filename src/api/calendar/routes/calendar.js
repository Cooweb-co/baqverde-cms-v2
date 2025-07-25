'use strict';

/**
 * calendar router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::calendar.calendar', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
    create: {},
    update: {},
    delete: {},
  },
  only: [
    'find',
    'findOne',
    'create',
    'update',
    'delete'
  ],
  except: [],
  routes: [
    {
      method: 'GET',
      path: '/calendars/month/:monthNumber',
      handler: 'calendar.findByMonthNumber',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/calendars/current-month',
      handler: 'calendar.findCurrentMonth',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
});
