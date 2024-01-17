// About logging
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

// You will return here after you have performed the authorization.
// Now another call back has to take place to retrieve the bearer token.
new Oidc.UserManager({ response_mode: "query" })
  .signinCallback()
  .catch(function (err) {
    // If an error occurred during the callback.
    Oidc.Log.logger.error("error: " + err && err.message);
  });
