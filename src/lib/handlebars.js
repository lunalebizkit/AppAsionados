//const { format } = require('timeago.js');
const dayjs= require('dayjs');

const helpers= {};
// helpers.date= (timestamp) => {
//     return format(timestamp);
// }
// helpers.dayjs= (fecha) => {
//     return dayjs(fecha).format('DD/MM/YYYY')}
helpers.fechas= (timestamp) => {
    return dayjs(timestamp).format('DD/MM/YYYY')
}
module.exports= helpers;