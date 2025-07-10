module.exports = ({ env }) => ({
  enabled: true,
  origin: [
    'http://localhost:3000',
    'http://localhost:1337',
    'https://barranquillaverde.gov.co',
    'https://www.barranquillaverde.gov.co',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  headers: '*',
  keepHeaderOnError: true,
});
