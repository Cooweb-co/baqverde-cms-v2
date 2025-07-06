'use strict';

/**
 * informe-gestion router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/informe-gestions',
      handler: 'informe-gestion.find',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/informe-gestions/:id',
      handler: 'informe-gestion.findOne',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/informe-gestions/count',
      handler: 'informe-gestion.count',
      config: {
        policies: [],
        auth: false
      }
    }
  ]
};
