const { format } = require('timeago.js');

const helpers= {};
helpers.date= (timestamp) => {
    return format(timestamp);
}

module.exports= helpers;