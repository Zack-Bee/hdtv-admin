const { isDevelopMode } = require("../../config/config")

/**
 * 发送get请求
 * @param {String} url 请求的url 
 */
function get(url) {
    return fetch(url, {
        method: "GET",
        credentials: isDevelopMode ? "include" : "same-origin"
    })
}
export default get