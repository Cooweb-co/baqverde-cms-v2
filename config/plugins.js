module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  upload: {
    config: {
      provider: 'strapi-provider-cloudflare-r2',
      providerOptions: {
        // cloud_name: '45e3f5fd0378eddb9338076165751b4f' || env('CLOUDINARY_NAME'),
        accessKeyId: env('CLOUDINARY_KEY'),
        secretAccessKey: env('CLOUDINARY_SECRET'),
        endpoint: env('CF_ENDPOINT'),
        cloudflarePublicAccessUrl: env('CF_PUBLIC_ACCESS_URL'),
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