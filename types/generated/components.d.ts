import type { Attribute, Schema } from '@strapi/strapi';

export interface WorkExperience extends Schema.Component {
  collectionName: 'components_work_experiences';
  info: {
    description: 'Experiencia laboral del funcionario';
    displayName: 'Experience';
  };
  attributes: {
    endDate: Attribute.Date & Attribute.Required;
    entity: Attribute.String & Attribute.Required;
    position: Attribute.String & Attribute.Required;
    startDate: Attribute.Date & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'work.experience': WorkExperience;
    }
  }
}
