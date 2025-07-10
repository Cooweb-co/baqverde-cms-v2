'use strict';

/**
 * management-report controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::management-report.management-report', ({ strapi }) => ({
  async find(ctx) {
    try {
      console.log('Buscando management reports...');
      
      // Opción 1: Usando entityService
      const entries = await strapi.entityService.findMany('api::management-report.management-report', {
        populate: ['document'],
      });
      
      console.log('Registros encontrados (entityService):', JSON.stringify(entries, null, 2));
      
      // Opción 2: Usando query
      const query = strapi.db.query('api::management-report.management-report');
      const allEntries = await query.findMany({
        populate: ['document'],
      });
      
      console.log('Registros encontrados (query):', JSON.stringify(allEntries, null, 2));
      
      // Devolver los datos en el formato que espera Strapi v4
      return {
        data: allEntries.map(entry => ({
          id: entry.id,
          attributes: {
            ...entry,
            document: entry.document ? {
              data: {
                id: entry.document.id,
                attributes: entry.document
              }
            } : null
          }
        }))
      };
      
    } catch (err) {
      console.error('Error en el controlador find:', err);
      ctx.status = 500;
      return { 
        error: 'Error al obtener los informes',
        details: err.message 
      };
    }
  },
  
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`Buscando management report con ID: ${id}`);
      
      const entry = await strapi.entityService.findOne('api::management-report.management-report', id, {
        populate: ['document'],
      });
      
      console.log('Registro encontrado:', JSON.stringify(entry, null, 2));
      
      if (!entry) {
        ctx.status = 404;
        return { error: 'No se encontró el informe' };
      }
      
      // Formatear la respuesta según el estándar de Strapi v4
      return {
        data: {
          id: entry.id,
          attributes: {
            ...entry,
            document: entry.document ? {
              data: {
                id: entry.document.id,
                attributes: entry.document
              }
            } : null
          }
        }
      };
      
    } catch (err) {
      console.error('Error en el controlador findOne:', err);
      ctx.status = 500;
      return { 
        error: 'Error al obtener el informe',
        details: err.message 
      };
    }
  }
}));
