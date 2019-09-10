'use strict';

const defaultPort = 3000;

const config = {
    port: process.env.PORT || defaultPort
}

module.exports.envConfig = config