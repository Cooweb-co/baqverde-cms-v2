'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

// Crear el router por defecto para las rutas CRUD
const defaultRouter = createCoreRouter('api::budget.budget', {
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
    path: '/budgets/signed-url/:fileId',
    handler: 'budget.getSignedUrl',
    config: {
      auth: false,
      description: 'Obtener URL firmada para un archivo de presupuesto',
      policies: [],
      middlewares: [],
    },
  },
];

// Exportar el router personalizado
module.exports = customRouter(defaultRouter, customRoutes);
