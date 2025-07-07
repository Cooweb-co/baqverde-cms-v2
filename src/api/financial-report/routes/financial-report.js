'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

// Crear el router por defecto para las rutas CRUD
const defaultRouter = createCoreRouter('api::financial-report.financial-report', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
  only: ['find', 'findOne'],
});

// Función para combinar rutas personalizadas con las rutas por defecto
const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes;
      return [...routes, ...extraRoutes];
    },
  };
};

// Definir rutas personalizadas
const customRoutes = [
  {
    method: 'GET',
    path: '/financial-reports/test-signed-url',
    handler: 'financial-report.testSignedUrl',
    config: {
      auth: false,
      description: 'Endpoint de prueba para generar URLs firmadas',
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/financial-reports/signed-url/:fileId',
    handler: 'financial-report.getSignedUrl',
    config: {
      auth: false,
      description: 'Obtener URL firmada para un archivo',
      policies: [],
      middlewares: [],
    },
  },
];

// Exportar el router personalizado
module.exports = customRouter(defaultRouter, customRoutes);
