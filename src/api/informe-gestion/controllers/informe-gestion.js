'use strict';

/**
 * informe-gestion controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::informe-gestion.informe-gestion', ({ strapi }) => ({
  async find(ctx) {
    try {
      const { results, pagination } = await strapi.service('api::informe-gestion.informe-gestion').find({
        ...ctx.query,
        populate: ['archivo_pdf']
      });
      
      const sanitizedResults = await this.sanitizeOutput(results, ctx);
      
      return this.transformResponse(sanitizedResults, { pagination });
    } catch (error) {
      console.error('Error en find:', error);
      ctx.badRequest('Error al obtener los informes de gestión', { error });
    }
  },
  
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const entity = await strapi.db.query('api::informe-gestion.informe-gestion').findOne({
        where: { id },
        populate: ['archivo_pdf']
      });
      
      if (!entity) {
        return ctx.notFound('Informe de gestión no encontrado');
      }
      
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      console.error('Error en findOne:', error);
      ctx.badRequest('Error al obtener el informe de gestión', { error });
    }
  },
  
  async count(ctx) {
    try {
      const count = await strapi.db.query('api::informe-gestion.informe-gestion').count({
        where: ctx.query.filters || {}
      });
      
      return { count };
    } catch (error) {
      console.error('Error en count:', error);
      ctx.badRequest('Error al contar los informes de gestión', { error });
    }
  }
}));
