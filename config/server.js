module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  proxy: true,
  cors: {
    enabled: true,
    origin: [
      'http://localhost:4321',
      'http://localhost:3000',
      'https://baq-verde.web.app',
      'https://baq-verde.firebaseapp.com',
      'https://baq-verde.vercel.app',
      'https://www.barranquillaverde.gov.co',
      'https://barranquillaverde.gov.co'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    headers: '*',
    keepHeaderOnError: true,
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
});