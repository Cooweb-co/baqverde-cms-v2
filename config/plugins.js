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
        accessKeyId: env('CF_ACCESS_KEY_ID'),
        secretAccessKey: env('CF_SECRET_ACCESS_KEY'),
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
