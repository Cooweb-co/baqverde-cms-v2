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
      provider: 'local',
      providerOptions: {
        sizeLimit: 100 * 1024 * 1024, // 100MB en bytes
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {}
      },
      mimeTypes: ['application/pdf']
    },
  },
});