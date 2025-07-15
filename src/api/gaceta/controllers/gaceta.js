'use strict';

/**
 * gaceta controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::gaceta.gaceta', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Generar el título automáticamente
    if (data.tipo_gaceta && data.numero && data.anio) {
      const titulo = await strapi.plugin('custom-field').service('customField')
        .generateTitle(data.tipo_gaceta, data.numero, data.anio);
      
      data.titulo = titulo;
    }

    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    // Si se actualiza algún campo relevante, regenerar el título
    if (data.tipo_gaceta || data.numero || data.anio) {
      const existing = await strapi.entityService.findOne('api::gaceta.gaceta', id, {
        fields: ['tipo_gaceta', 'numero', 'anio']
      });

      const tipoGaceta = data.tipo_gaceta || existing.tipo_gaceta;
      const numero = data.numero || existing.numero;
      const anio = data.anio || existing.anio;

      if (tipoGaceta && numero && anio) {
        const titulo = await strapi.plugin('custom-field').service('customField')
          .generateTitle(tipoGaceta, numero, anio);
        
        data.titulo = titulo;
      }
    }

    const response = await super.update(ctx);
    return response;
  },

  async findByYear(ctx) {
    const { anio } = ctx.params;
    const entities = await strapi.db.query('api::gaceta.gaceta').findMany({
      where: { anio: parseInt(anio) },
      orderBy: { fecha_publicacion: 'desc' },
    });
    return this.transformResponse(entities);
  },

  async findByCategory(ctx) {
    const { categoria } = ctx.params;
    const entities = await strapi.db.query('api::gaceta.gaceta').findMany({
      where: { 
        categoria,
        visible: true 
      },
      orderBy: { fecha_publicacion: 'desc' },
    });
    return this.transformResponse(entities);
  },

  async find(ctx) {
    const { query } = ctx;
    const { results, pagination } = await strapi.service('api::gaceta.gaceta').find({
      ...query,
      populate: ['uploadFile']
    });
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults, { pagination });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.db.query('api::gaceta.gaceta').findOne({
      where: { id },
      populate: ['uploadFile']
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async count(ctx) {
    const count = await strapi.db.query('api::gaceta.gaceta').count({
      where: { visible: true }
    });
    return { count };
  },
}));
