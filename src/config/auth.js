module.exports = {
  auth: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri:
      process.env.REACT_APP_ENV === "development"
        ? "http://localhost:3000/callback"
        : process.env.REACT_APP_ENV === "staging"
        ? "https://staging.swimpufferfish.com/callback"
        : process.env.REACT_APP_ENV === "production"
        ? "https://app.swimpufferfish.com/callback"
        : process.env.REACT_APP_AUTH0_REDIRECT,
    responseType: "token id_token",
    scope: "openid",
  },
};
