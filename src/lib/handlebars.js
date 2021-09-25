//const { format } = require('timeago.js');
const dayjs= require('dayjs');
const helpers= {};

// helpers.date= (timestamp) => {
//     return format(timestamp);
// }
helpers.fechas= (timestamp) => {
    return dayjs(timestamp).format('DD/MM/YYYY')}
helpers.horas= (timestamp) => {
    return dayjs(timestamp).format('sss' + 1)
}
helpers.fechaCompara= (timestamp) => {
    return dayjs(timestamp).format('YYYY-MM-DD')}
module.exports= helpers;