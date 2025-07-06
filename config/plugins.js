module.exports = ({ env }) => ({
  'custom-field': {
    enabled: true,
    resolve: './src/plugins/custom-field'
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  upload: {
    config: {
      provider: 'strapi-provider-cloudflare-r2',
      providerOptions: {
        accessKeyId: env('CLOUDINARY_KEY'),
        secretAccessKey: env('CLOUDINARY_SECRET'),
        endpoint: env('CF_ENDPOINT'),
        cloudflarePublicAccessUrl: env('CF_PUBLIC_ACCESS_URL'),
        // Forzar la descarga de archivos PDF
        s3Options: {
          params: {
            ResponseContentDisposition: 'inline',
            ResponseContentType: 'application/pdf',
          },
        },
        params: {
          Bucket: env('CF_BUCKET'),
        },
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
