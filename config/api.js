module.exports = ({ env }) => ({
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
    prefix: '/api',
    defaultContentType: 'application/json',
  },
  responses: {
    privateAttributes: ['createdAt', 'updatedAt', 'publishedAt'],
    wrapResponse: true,
  },
});