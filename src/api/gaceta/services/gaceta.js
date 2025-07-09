'use strict';

/**
 * gaceta service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::gaceta.gaceta', ({ strapi }) => ({
  // Genera el formato del acto administrativo
  generarFormatoActo(entry) {
    const prefijos = {
      'Resolución': 'Res.',
      'Auto': 'Auto.',
      'Notificación': 'Notif.'
    };

    const prefijo = prefijos[entry.tipo_gaceta] || '';
    const anio = new Date(entry.fecha_publicacion).getFullYear();
    const numeroFormateado = String(entry.numero).padStart(4, '0');
    
    // Formato: [Prefijo][Número]-[Año] [Empresa/Persona]
    return `${prefijo}${numeroFormateado}-${anio} ${entry.empresa_persona}`.trim();
  },

  // Sobrescribir el método create para generar el acto administrativo automáticamente
  async create(params) {
    const entry = await super.create(params);
    const actoAdministrativo = this.generarFormatoActo(entry);
    
    return await strapi.entityService.update('api::gaceta.gaceta', entry.id, {
      data: { acto_administrativo: actoAdministrativo }
    });
  },

  // Sobrescribir el método update para actualizar el acto administrativo cuando cambien los campos relacionados
  async update(id, params) {
    const entry = await super.update(id, params);
    const actoAdministrativo = this.generarFormatoActo(entry);
    
    return await strapi.entityService.update('api::gaceta.gaceta', id, {
      data: { acto_administrativo: actoAdministrativo }
    });
  }
}));
