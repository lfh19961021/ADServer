/*
 * Import
 */
import passport from 'passport';
import passport_azure from 'passport-azure-ad';
import debug_js from 'debug';
import config from '../config/azuread.js';

const debug = debug_js('azure:modules');

// const passport = require('passport');
// const passport_azure = require('passport-azure-ad');
// const debug = require('debug')('azure:modules');
// const config = require('../config/azuread');

/*
 * Azure AD Module
 */
const logName = 'Module Azure AD -';
const azure = {
  config: config,

  get: {
    openId: {
      sign: {
        in: (iss, sub, userProfile, accessToken, refreshToken, done) => {
          return new Promise((resolve, reject) => {
            try {
              debug(logName, 'openId - signin');

              if (!userProfile.oid) {
                done(new Error('user.oidNotFound'), null);
                resolve();
                return;
              }

              done(null, userProfile);
              resolve();
            } catch (error) {
              console.error(logName, 'init');
              reject(error);
            }
          });
        },
        out: (req, res, next) => {
          return new Promise((resolve, reject) => {
            try {
              req.logout();
              resolve();
            } catch (error) {
              console.error(logName, 'init');
              reject(error);
            }
          });
        },
      },
      regenerateSessionAfterAuthentication: (req, res, next) => {
        debug(logName, 'openId - regenerateSessionAfterAuthentication');

        const passportInstance = req.session.passport;

        return req.session.regenerate((err) => {
          if (err) {
            return next(err);
          }
          req.session.passport = passportInstance;

          return req.session.save(next);
        });
      },
    },
    bearer: {
      verifyToken: (token, done) => {
        return new Promise(async (resolve, reject) => {
          try {
            debug(logName, 'bearer - verifyToken');
            debug(token);

            // const userResult = await user.get.byId(token.oid).catch((error) => {
            //   done(error);
            //   resolve();
            //   return;
            // });

            // if (!userResult.recordset[0]) {
            //   done(new Error('user.oidNotFound'), null);
            //   resolve();
            //   return;
            // }

            done(null, {}, token);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      },
    },
  },
  check: {
    user: (req, res, redirectPath = '/login', login = false, adminOnly = false) => {
      return new Promise((resolve, reject) => {
        try {
          if (login) {
            if (req.user) {
              res.redirect(redirectPath);
            } else {
              resolve();
            }
          } else {
            if (!req.user) {
              res.redirect(redirectPath);
            } else {
              if (!adminOnly || (adminOnly && req.user.user_type_id == 'admin')) {
                resolve();
              } else {
                res.redirect(redirectPath);
              }
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    openId: (redirect = true) => {
      const options = {
        // options.session: true,
        // customState: null,
        // resourceURL: null,
        // tenantIdOrName: null,
        // domain_hint: null,
        // login_hint: null,
        // prompt: null,
        // response: null,
      };

      if (redirect) {
        options.failureRedirect = '/';
      }

      return passport.authenticate('azuread-openidconnect', options);
    },
    bearer: (session = false) => {
      const options = {
        session: session,
      };

      return passport.authenticate('oauth-bearer', options);
    },
  },

  passport: {
    init: () => {
      passport.serializeUser((userProfile, done) => {
        done(null, userProfile);
      });

      passport.deserializeUser(async (userProfile, done) => {
        done(null, userProfile);

        // const userObj = await user.check.whitelist(userProfile);

        // if (!userObj) {
        //   done(new Error(profile.get.error('user.permissionDenied')), null);
        // } else {
        //   done(null, userObj);
        // }
      });
    },
  },
  openId: {
    init: () => {
      const options = {
        identityMetadata: azure.config.identityMetadata,
        responseType: azure.config.responseType,
        responseMode: azure.config.responseMode,
        redirectUrl: azure.config.url.redirect,
        issuer: azure.config.issuer,
        scope: azure.config.scope,
        clientID: azure.config.application.clientId,
        clientSecret: azure.config.clientCredentials.secrets.value,
      };

      passport.use(new passport_azure.OIDCStrategy(options, azure.get.openId.sign.in));
    },
  },
  bearer: {
    init: () => {
      const options = {
        identityMetadata: azure.config.identityMetadata,
        clientID: azure.config.application.clientId,
        issuer: azure.config.issuer,
      };

      passport.use(new passport_azure.BearerStrategy(options, azure.get.bearer.verifyToken));
    },
  },

  init: () => {
    try {
      azure.passport.init();
      azure.openId.init();
      azure.bearer.init();
    } catch (error) {
      console.error(logName, 'init');
      console.error(error);
      debug(error);
    }
  },
};

azure.init();

// module.exports = azure;

export default azure;