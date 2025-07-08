'use strict';

/**
 * informe-gestion service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::informe-gestion.informe-gestion', ({ strapi }) => ({
  async find(params) {
    const { results, pagination } = await super.find({
      ...params,
      populate: ['archivo_pdf']
    });
    
    return { results, pagination };
  },
  
  async findOne(id, params = {}) {
    const result = await super.findOne(id, {
      ...params,
      populate: ['archivo_pdf']
    });
    
    return result;
  },
  
  async count(params = {}) {
    const count = await strapi.db.query('api::informe-gestion.informe-gestion').count({
      where: params.filters || {}
    });
    
    return { count };
  }
}));
