'use strict';

module.exports = ({ strapi }) => {
  // Register the custom field type
  strapi.customFields.register({
    name: 'gaceta-title',
    plugin: 'custom-field',
    type: 'string',
  });
};
