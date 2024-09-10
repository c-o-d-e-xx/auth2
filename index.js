const got = require('got'),

    inquirer = require('@inquirer/prompts'),

    DIVIDER = '|----------------------|',

    DEVICE_API = 'https://oauth2.googleapis.com/device/code',

    TOKEN_API = 'https://oauth2.googleapis.com/token',

    CLIENT_ID = '348997417467-sjqj9tektamb7r4q6j7eic2t1g6nqbos.apps.googleusercontent.com',

    CLIENT_SECRET = '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';



console.log(DIVIDER);

console.log('| Generate OAuth Token |');

console.log(DIVIDER);

console.log('|- OAuth2 Client Info -|');

console.log('| Client ID: ' + CLIENT_ID);

console.log('| Client Secret: ' + CLIENT_SECRET);

console.log(DIVIDER + '\n\n');



function errorHandler(error) {

    console.error('| Failed to update OAuth token.');

    console.error(DIVIDER);

    console.error('|    ↓ Details ↓     |');

    console.error(error);

}



function generateToken() {

    got.post(DEVICE_API, {

        form: {

            client_id: CLIENT_ID,

            scope: 'https://www.googleapis.com/auth/youtube',

        },

        responseType: 'json',

    })

        .then(({ body: deviceApiResponse }) => {

            console.log(DIVIDER);

            console.log('|   Success Request1   |');

            console.log(`|     URL    : ${deviceApiResponse.verification_url}`);

            console.log(`| Device Code: ${deviceApiResponse.user_code}`);

            console.log(`|     Info   : Open the URL and follow the instructions.`);

            console.log(DIVIDER + '\n\n');



            inquirer

                .confirm({

                    message: 'Did you go to the end?',

                    default: true,

                })

                .then(() => {

                    got.post(TOKEN_API, {

                        form: {

                            client_id: CLIENT_ID,

                            client_secret: CLIENT_SECRET,

                            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',

                            device_code: deviceApiResponse.device_code,

                        },

                        responseType: 'json',

                    })

                        .then(({ body: tokenApiResponse }) => {

                            const OAUTH2_DATA = JSON.stringify(

                                {

                                    accessToken: tokenApiResponse.access_token,

                                    refreshToken: tokenApiResponse.refresh_token,

                                    expiryDate: new Date(Date.now() + tokenApiResponse.expires_in * 1000).toISOString(),

                                    expiresIn: tokenApiResponse.expires_in,

                                    scope: tokenApiResponse.scope,

                                    tokenType: tokenApiResponse.token_type,

                                },

                                null,

                                2,

                            );



                            console.log(OAUTH2_DATA);

                        })

                        .catch(errorHandler);

                })

                .catch(errorHandler);

        })

        .catch(errorHandler);

}



if (CLIENT_ID === 'YOUR CLIENT ID HERE' || CLIENT_SECRET === 'YOUR CLIENT SECRET HERE') {

    console.error(DIVIDER);

    console.error('| Missing Client ID or Client Secret.');

    console.error(DIVIDER);

} else {

    generateToken();

}
