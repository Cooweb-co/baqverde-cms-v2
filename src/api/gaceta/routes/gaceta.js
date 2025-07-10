module.exports = {
  routes: [
    // Endpoints existentes
    {
      method: 'GET',
      path: '/gacetas',
      handler: 'gaceta.find',
      config: {
        policies: [],
        auth: false
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
    },
    
    // Nuevos endpoints para operaciones CRUD
    {
      method: 'POST',
      path: '/gacetas',
      handler: 'gaceta.create',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'PUT',
      path: '/gacetas/:id',
      handler: 'gaceta.update',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'DELETE',
      path: '/gacetas/:id',
      handler: 'gaceta.delete',
      config: {
        policies: [],
        auth: false
      }
    }
  ]
};
