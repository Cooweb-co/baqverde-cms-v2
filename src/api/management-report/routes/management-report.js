'use strict';

/**
 * management-report router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::management-report.management-report', {
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
      description: 'Obtener todos los informes de gestión',
      tags: ['Management Reports']
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: [],
      description: 'Obtener un informe de gestión por ID',
      tags: ['Management Reports']
    },
  },
  only: ['find', 'findOne'],
  prefix: '',  // Asegurar que no hay prefijo adicional
});
