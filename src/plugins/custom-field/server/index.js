'use strict';

module.exports = async (plugin) => {
  // Registrar el campo personalizado
  await registerCustomField(plugin);
  
  // Configurar servicios
  plugin.services.customField = {
    async generateTitle(tipoGaceta, numero, anio) {
      const prefijos = {
        'Resolución': 'Res.',
        'Auto': 'Auto.',
        'Notificación': 'Notif.'
      };
      const prefijo = prefijos[tipoGaceta] || '';
      return `${prefijo}${String(numero).padStart(4, '0')}-${anio}`;
    },
    
    async generateId(tipoGaceta, numero, anio) {
      const prefijos = {
        'Resolución': 'RES',
        'Auto': 'AUTO',
        'Notificación': 'NOTIF'
      };
      const prefijo = prefijos[tipoGaceta] || '';
      return `${prefijo}${String(numero).padStart(4, '0')}-${anio}`;
    }
  };

  return plugin;
};

async function registerCustomField(plugin) {
  const { register } = plugin.controllers;
  
  // Registrar el campo personalizado
  plugin.contentTypes['gaceta'].attributes.titulo = {
    type: 'customField',
    customField: 'plugin::custom-field.gaceta-title',
    required: true
  };
  
  // Registrar el componente de administración
  plugin.components = {
    ...plugin.components,
    'customField': {
      'gaceta-title': () => import('./admin/src')
    }
  };
}
