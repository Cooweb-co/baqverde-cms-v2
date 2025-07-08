module.exports = ({ env }) => ({
  enabled: true,
  origin: [
    'http://localhost:3000',
    'http://localhost:4321',
    'http://localhost:1337',
    'http://127.0.0.1:1337',
    'https://baq-verde.web.app',
    'https://baq-verde.firebaseapp.com',
    'https://baq-verde.vercel.app',
    'https://www.barranquillaverde.gov.co',
    'https://barranquillaverde.gov.co'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  headers: [
    'Content-Type',
    'Authorization',
    'X-Frame-Options',
    'X-Requested-With'
  ],
  expose: [
    'Content-Disposition',
    'Content-Length',
    'Content-Type'
  ],
  credentials: true,
  keepHeaderOnError: true,
  maxAge: 600,
  preflightContinue: false,
  optionsSuccessStatus: 204
});
