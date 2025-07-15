'use strict';

/**
 * gaceta router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/gacetas',
      handler: 'gaceta.find',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/gacetas/:id',
      handler: 'gaceta.findOne',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/gacetas/count',
      handler: 'gaceta.count',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/gacetas/por-anio/:anio',
      handler: 'gaceta.findByYear',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/gacetas/categoria/:categoria',
      handler: 'gaceta.findByCategory',
      config: {
        policies: [],
        auth: false
      }
    }
  ]
};
