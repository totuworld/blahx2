module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '500kb',
    },
  },
  reactStrictMode: true,
  publicRuntimeConfig: {
    publicApiKey: process.env.publicApiKey || '',
    authDomain: process.env.FIREBASE_AUTH_HOST || '',
    projectId: process.env.projectId || '',
  },
}
