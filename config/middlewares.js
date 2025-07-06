module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'connect-src': ["'self'", 'https:', 'http:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com',
            env('CF_PUBLIC_ACCESS_URL') ? env('CF_PUBLIC_ACCESS_URL').replace(/^https?:\/\//, '') : '',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com',
            'http://localhost:1337',
            'https://localhost:1337',
            env('CF_PUBLIC_ACCESS_URL') ? env('CF_PUBLIC_ACCESS_URL').replace(/^https?:\/\//, '') : '',
          ],
          'object-src': ["'self'", 'data:', 'blob:'],
          'frame-src': ["'self'", 'data:', 'blob:'],
          'child-src': ["'self'", 'data:', 'blob:'],
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          upgradeInsecureRequests: null,
          'X-Content-Type-Options': 'nosniff',
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'http://localhost:4321',
        'http://localhost:1337',
        'https://baq-verde.web.app',
        'https://baq-verde.firebaseapp.com',
        'https://baq-verde.vercel.app',
        'https://www.barranquillaverde.gov.co',
        'https://barranquillaverde.gov.co'
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: '*',
      keepHeaderOnError: true,
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
