/*
* Lane Crawford Azure AD Config
*/

// https://github.com/AzureAD/passport-azure-ad
const config = {
    identityMetadata: null,
    responseType: 'id_token',		// or 'id_token code'	- code: request accesstoken, required clientCredentials.secrets.value which need to be created in Azure AD separately, and with maxium 2 years duration only
    responseMode: 'form_post',

    scope: ['email', 'profile'],

    url: {
        redirect: 'https://localhost:3000/api/oauth/return',
        logout: 'https://localhost:3000/api/oauth/logout',
    },

    objectId: 'd37ae0ef-42e4-4994-a962-d15d91c958b5',
    tenantId: '802883cc-913e-4584-9391-78fbb7279c91',

    application: {
        clientId: 'f9b3d1d1-5467-4c12-a6eb-2cf062293d68',
        idUrl: 'api://f9b3d1d1-5467-4c12-a6eb-2cf062293d68',
    },

    clientCredentials: {
        secrets: {
            id: null,
            value: null,
        }
    },

    init: () => {
        config.identityMetadata = 'https://login.microsoftonline.com/' + config.tenantId + '/v2.0/.well-known/openid-configuration';
    },
};

config.init();

// module.exports = config;
export default config;