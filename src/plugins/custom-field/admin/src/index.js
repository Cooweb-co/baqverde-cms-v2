import React, { useState, useEffect } from 'react';
import { TextInput } from '@strapi/design-system/TextInput';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
import { Flex } from '@strapi/design-system/Flex';
import { Button } from '@strapi/design-system/Button';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

const GacetaTitleField = ({
  name,
  attribute,
  onChange,
  value,
}) => {
  const { modifiedData } = useCMEditViewDataManager();
  const [showId, setShowId] = useState(false);
  const [idValue, setIdValue] = useState('');

  useEffect(() => {
    // Generar la identificación basada en los campos relevantes
    const generateId = () => {
      const tipo = modifiedData.tipo_gaceta || '';
      const numero = modifiedData.numero || '';
      const anio = modifiedData.anio || '';
      
      if (tipo && numero && anio) {
        const prefijos = {
          'Resolución': 'RES',
          'Auto': 'AUTO',
          'Notificación': 'NOTIF'
        };
        
        const prefijo = prefijos[tipo] || '';
        return `${prefijo}${String(numero).padStart(4, '0')}-${anio}`;
      }
      return '';
    };

    setIdValue(generateId());
  }, [modifiedData.tipo_gaceta, modifiedData.numero, modifiedData.anio]);

  return (
    <Stack spacing={2}>
      <Flex>
        <TextInput
          name={name}
          value={showId ? idValue : value}
          onChange={onChange}
          label={attribute.required ? `${attribute.label} *` : attribute.label}
          disabled={showId}
          style={{ flex: 1 }}
        />
        <Button 
          onClick={() => setShowId(!showId)}
          style={{ marginLeft: '8px', marginTop: '22px' }}
          variant="tertiary"
        >
          {showId ? 'Ver Título' : 'Ver ID'}
        </Button>
      </Flex>
      <Typography variant="pi" textColor="neutral600">
        {showId ? 'ID de referencia' : 'Título descriptivo'}
      </Typography>
    </Stack>
  );
};

export { GacetaTitleField as default };
