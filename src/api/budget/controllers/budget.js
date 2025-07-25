'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

module.exports = createCoreController('api::budget.budget', ({ strapi }) => ({
  // Endpoint para obtener URL firmada
  async getSignedUrl(ctx) {
    console.log('=== INICIO getSignedUrl ===');
    console.log('Contexto recibido:', {
      params: ctx.params,
      query: ctx.query,
      headers: ctx.headers
    });

    try {
      const { fileId } = ctx.params;
      
      if (!fileId) {
        const error = new Error('Se requiere el parámetro fileId');
        console.error('Error en getSignedUrl:', error);
        return ctx.badRequest(error.message);
      }
      
      console.log('Buscando archivo en la base de datos con ID:', fileId);
      
      // Obtener la información del archivo con más campos para depuración
      const file = await strapi.entityService.findOne('plugin::upload.file', fileId, {
        fields: ['name', 'hash', 'ext', 'mime', 'size', 'url', 'provider', 'createdAt', 'updatedAt']
      });
      
      if (!file) {
        const error = new Error(`Archivo no encontrado para el ID: ${fileId}`);
        console.error('Error en getSignedUrl:', error);
        return ctx.notFound(error.message);
      }
      
      console.log('Archivo encontrado en la base de datos:', {
        id: fileId,
        name: file.name,
        mime: file.mime,
        size: file.size,
        hash: file.hash,
        ext: file.ext,
        url: file.url,
        provider: file.provider,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt
      });
      
      // Si el archivo ya tiene una URL pública, la devolvemos directamente
      if (file.url) {
        console.log('Usando URL pública del archivo:', file.url);
        return { url: file.url };
      }
      
      console.log('Iniciando generación de URL firmada...');
      
      // Obtener la configuración del plugin de upload
      console.log('Obteniendo configuración del plugin de upload...');
      const uploadPlugin = strapi.plugin('upload');
      const uploadConfig = uploadPlugin.config;
      const providerConfig = uploadConfig?.providerOptions;
      
      console.log('Configuración del plugin de upload:', {
        uploadConfig: {
          ...uploadConfig,
          providerOptions: {
            ...providerConfig,
            // No mostrar credenciales completas por seguridad
            accessKeyId: providerConfig?.accessKeyId ? '***' : undefined,
            secretAccessKey: providerConfig?.secretAccessKey ? '***' : undefined,
          }
        }
      });
      
      // Verificar variables de entorno
      const envVars = {
        CF_ENDPOINT: process.env.CF_ENDPOINT,
        CF_BUCKET: process.env.CF_BUCKET,
        CLOUDINARY_KEY: process.env.CLOUDINARY_KEY ? '***' : undefined,
        CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET ? '***' : undefined,
      };
      
      console.log('Variables de entorno relevantes:', envVars);
      
      // Usar las variables de entorno directamente para asegurar que tenemos los valores correctos
      const endpoint = process.env.CF_ENDPOINT || providerConfig?.endpoint;
      const bucket = process.env.CF_BUCKET || providerConfig?.params?.Bucket;
      const accessKeyId = process.env.CLOUDINARY_KEY || providerConfig?.accessKeyId;
      const secretAccessKey = process.env.CLOUDINARY_SECRET || providerConfig?.secretAccessKey;
      
      if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
        const error = new Error('Configuración incompleta del proveedor de almacenamiento');
        console.error('Error en getSignedUrl - Configuración faltante:', {
          endpoint: endpoint || 'FALTA',
          bucket: bucket || 'FALTA',
          accessKeyId: accessKeyId ? '***' : 'FALTA',
          secretAccessKey: secretAccessKey ? '***' : 'FALTA',
          usingEnvVars: {
            endpoint: !!process.env.CF_ENDPOINT,
            bucket: !!process.env.CF_BUCKET,
            accessKeyId: !!process.env.CLOUDINARY_KEY,
            secretAccessKey: !!process.env.CLOUDINARY_SECRET
          }
        });
        throw error;
      }
      
      console.log('Configuración final del proveedor de almacenamiento:', {
        endpoint,
        bucket,
        hasCredentials: {
          accessKeyId: !!accessKeyId,
          secretAccessKey: !!secretAccessKey,
        },
        usingEnvVars: {
          endpoint: !!process.env.CF_ENDPOINT,
          bucket: !!process.env.CF_BUCKET,
          accessKeyId: !!process.env.CLOUDINARY_KEY,
          secretAccessKey: !!process.env.CLOUDINARY_SECRET
        }
      });
      
      // Configurar el cliente S3 para Cloudflare R2
      console.log('Configurando cliente S3...');
      const s3Client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: true,
      });
      
      const key = file.hash + file.ext;
      console.log('Generando comando GetObject para:', { bucket, key, filename: file.name });
      
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${file.name}"`,
      });
      
      console.log('Generando URL firmada...');
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      
      console.log('URL firmada generada exitosamente:', {
        url: signedUrl,
        length: signedUrl?.length
      });
      
      return { 
        url: signedUrl,
        debug: {
          fileId,
          key,
          bucket,
          generatedAt: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('=== ERROR en getSignedUrl ===');
      console.error('Mensaje de error:', error.message);
      console.error('Stack trace:', error.stack);
      
      if (error.$metadata) {
        console.error('Metadatos del error AWS:', error.$metadata);
      }
      
      if (error.name) {
        console.error('Nombre del error:', error.name);
      }
      
      if (error.code) {
        console.error('Código de error:', error.code);
      }
      
      // Enviar respuesta de error detallada
      ctx.status = error.status || 500;
      ctx.body = {
        error: {
          message: error.message,
          name: error.name,
          code: error.code,
          status: error.status || 500,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          timestamp: new Date().toISOString()
        },
        request: {
          fileId: ctx.params.fileId,
          method: ctx.method,
          url: ctx.url,
          headers: ctx.headers
        }
      };
      
      // Asegurarse de que el error se siga propagando
      throw error;
    } finally {
      console.log('=== FIN getSignedUrl ===');
    }
  },
}));
