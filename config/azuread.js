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

    objectId: '1bd39857-9ad8-4314-9c53-75b7e465e7a6',
    tenantId: '9e411b68-07d6-4b08-b730-8fe67ba7ab64',

    application: {
        clientId: '58aba3ca-9877-4b4d-acbf-f4655774d24f',
        idUrl: 'api://58aba3ca-9877-4b4d-acbf-f4655774d24f',
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

module.exports = config;