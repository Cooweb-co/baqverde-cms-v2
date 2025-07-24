'use strict';

/**
 * main-modal controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::main-modal.main-modal', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        featuredImage: true
      }
    };

    const entity = await super.find(ctx);
    
    // Si no hay entidad o no está activa, retornamos null
    if (!entity?.data?.attributes?.isActive) {
      return { data: null, meta: entity.meta };
    }

    const { startDate, endDate } = entity.data.attributes;
    const now = new Date();

    // Verificar si estamos dentro del rango de fechas (si se especificaron)
    if (startDate && new Date(startDate) > now) {
      return { data: null, meta: entity.meta };
    }
    if (endDate && new Date(endDate) < now) {
      return { data: null, meta: entity.meta };
    }

    return entity;
  }
})); 