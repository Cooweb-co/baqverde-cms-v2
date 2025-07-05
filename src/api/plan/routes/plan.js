'use strict';

/**
 * plan router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/plans',
      handler: 'plan.find',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/plans/:id',
      handler: 'plan.findOne',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/plans/category/:category',
      handler: 'plan.findByCategory',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/plans/year/:year',
      handler: 'plan.findByYear',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/plans',
      handler: 'plan.create',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/plans/:id',
      handler: 'plan.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/plans/:id',
      handler: 'plan.delete',
      config: {
        policies: []
      }
    }
  ]
}; 