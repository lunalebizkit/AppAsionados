//const { format } = require('timeago.js');
var localizedFormat = require('dayjs/plugin/localizedFormat')

const dayjs= require('dayjs');
const helpers= {};
dayjs().format('L');
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