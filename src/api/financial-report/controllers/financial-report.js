'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

module.exports = createCoreController('api::financial-report.financial-report', ({ strapi }) => ({
  // Endpoint de prueba - Quitar en producción
  async testSignedUrl(ctx) {
    try {
      console.log('=== Iniciando testSignedUrl ===');
      
      const { fileId } = ctx.query;
      
      if (!fileId) {
        console.error('Error: Se requiere el parámetro fileId');
        return ctx.badRequest('Se requiere el parámetro fileId');
      }
      
      console.log('Solicitando URL firmada de prueba para el archivo ID:', fileId);
      
      try {
        // Obtener la información del archivo usando entityService
        console.log('Buscando archivo en la base de datos...');
        const file = await strapi.entityService.findOne('plugin::upload.file', fileId);
        
        if (!file) {
          console.error('Error: Archivo no encontrado para el ID:', fileId);
          return ctx.notFound('Archivo no encontrado');
        }
        
        console.log('Archivo encontrado:', {
          id: file.id,
          name: file.name,
          mime: file.mime,
          size: file.size,
          hash: file.hash,
          ext: file.ext
        });
        
        // Obtener la configuración del plugin de upload
        console.log('Obteniendo configuración del plugin de upload...');
        const uploadConfig = strapi.plugins.upload.config;
        const providerConfig = uploadConfig.providerOptions;
        
        if (!providerConfig) {
          throw new Error('No se pudo cargar la configuración del proveedor de almacenamiento');
        }
        
        // Mostrar configuración en consola para depuración (sin exponer credenciales)
        console.log('Configuración del proveedor:', {
          endpoint: providerConfig.endpoint,
          bucket: providerConfig.params?.Bucket,
          hasCredentials: {
            accessKeyId: !!process.env.CLOUDINARY_KEY || !!providerConfig.accessKeyId,
            secretAccessKey: !!process.env.CLOUDINARY_SECRET || !!providerConfig.secretAccessKey,
          },
          fileExists: !!file
        });
        
        // Validar configuración
        if (!providerConfig.endpoint || !providerConfig.params?.Bucket) {
          throw new Error('Configuración incompleta del proveedor de almacenamiento');
        }
        
        // Usar las credenciales de las variables de entorno
        const accessKeyId = process.env.CLOUDINARY_KEY || providerConfig.accessKeyId;
        const secretAccessKey = process.env.CLOUDINARY_SECRET || providerConfig.secretAccessKey;
        
        if (!accessKeyId || !secretAccessKey) {
          throw new Error('No se encontraron credenciales de Cloudflare R2');
        }
        
        console.log('Creando cliente S3...');
        const s3Client = new S3Client({
          region: 'auto',
          endpoint: providerConfig.endpoint,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          forcePathStyle: true,
        });
        
        const fileKey = file.hash + file.ext;
        const bucket = providerConfig.params.Bucket;
        
        // Crear comando para obtener el objeto
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: fileKey,
          ResponseContentDisposition: `inline; filename="${file.name.replace(/"/g, '\\"')}"`,
        });
        
        console.log('Comando S3 creado:', {
          Bucket: bucket,
          Key: fileKey,
          fileInfo: {
            name: file.name,
            mime: file.mime,
            size: file.size
          }
        });
        
        console.log('Generando URL firmada...');
        
        // Generar URL firmada con una validez de 5 minutos (300 segundos)
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
        
        console.log('URL firmada generada exitosamente');
        
        // Devolver la URL firmada directamente como texto plano
        ctx.set('Content-Type', 'text/plain');
        ctx.body = signedUrl;
        
      } catch (error) {
        console.error('Error en testSignedUrl:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          code: error.code,
          region: error.region,
          time: error.time,
          requestId: error.requestId,
          statusCode: error.statusCode,
          retryable: error.retryable,
          retryDelay: error.retryDelay,
          hostId: error.hostId,
          cfId: error.cfId,
          extendedRequestId: error.extendedRequestId,
          cfRes: error.cfRes,
        });
        throw new Error(`Error al generar la URL firmada: ${error.message}`);
      }
      
    } catch (error) {
      console.error('Error en testSignedUrl:', error);
      return ctx.internalServerError(error.message || 'Error al generar la URL firmada');
    }
  },
  
  async getSignedUrl(ctx) {
    try {
      const { fileId } = ctx.params;
      
      console.log('Solicitando URL firmada para el archivo ID:', fileId);
      
      // Obtener la información del archivo usando entityService
      console.log('Buscando archivo en la base de datos...');
      const file = await strapi.entityService.findOne('plugin::upload.file', fileId, {
        fields: ['name', 'hash', 'ext', 'mime', 'size']
      });
      
      if (!file) {
        console.error('Archivo no encontrado para el ID:', fileId);
        return ctx.notFound('Archivo no encontrado');
      }
      
      console.log('Archivo encontrado:', {
        id: fileId,
        name: file.name,
        mime: file.mime,
        size: file.size,
        hash: file.hash,
        ext: file.ext
      });
      
      // Obtener la configuración del plugin de upload
      const uploadConfig = strapi.plugin('upload').config;
      const providerConfig = uploadConfig.providerOptions;
      
      // Usar las variables de entorno directamente para asegurar que tenemos los valores correctos
      const endpoint = process.env.CF_ENDPOINT || providerConfig?.endpoint;
      const bucket = process.env.CF_BUCKET || providerConfig?.params?.Bucket;
      const accessKeyId = process.env.CLOUDINARY_KEY || providerConfig?.accessKeyId;
      const secretAccessKey = process.env.CLOUDINARY_SECRET || providerConfig?.secretAccessKey;
      
      if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
        console.error('Configuración faltante:', {
          endpoint: !!endpoint,
          bucket: !!bucket,
          accessKeyId: !!accessKeyId,
          secretAccessKey: !!secretAccessKey
        });
        throw new Error('Configuración incompleta del proveedor de almacenamiento. Verifica las variables de entorno.');
      }
      
      console.log('Configuración del proveedor de almacenamiento:', {
        endpoint,
        bucket,
        hasCredentials: {
          accessKeyId: !!accessKeyId,
          secretAccessKey: !!secretAccessKey,
        }
      });
      
      // Configurar el cliente S3 para Cloudflare R2
      const s3Client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: true,
      });
      
      const fileKey = file.hash + file.ext;
      
      // Crear comando para obtener el objeto
      const command = new GetObjectCommand({
        Bucket: bucket, // Usamos la variable bucket que ya definimos arriba
        Key: fileKey,
        ResponseContentDisposition: `inline; filename="${file.name.replace(/"/g, '\\"')}"`,
      });
      
      console.log('Generando URL firmada...');
      
      // Generar URL firmada con una validez de 5 minutos (300 segundos)
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      
      console.log('URL firmada generada exitosamente');
      
      // Devolver la URL firmada
      return {
        url: signedUrl,
        expiresAt: new Date(Date.now() + 300000).toISOString()
      };
      
    } catch (error) {
      console.error('Error en getSignedUrl:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode,
      });
      return ctx.internalServerError(`Error al generar URL firmada: ${error.message}`);
    }
  },
}));
