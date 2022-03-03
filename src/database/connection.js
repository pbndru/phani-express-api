const monk = require('monk');

const databaseUrl = monk(process.env.Database_Url);

module.exports = databaseUrl;