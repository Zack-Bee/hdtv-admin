/**
 * @param {Date} date
 */
module.exports = function fromatDate(date) {
    let year = date.getFullYear(),
        month = (date.getMonth() + 1) <= 9 ? "0" + (date.getMonth() + 1) :
            date.getMonth(),
        day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate()
    return `${year}-${month}-${day}`
}