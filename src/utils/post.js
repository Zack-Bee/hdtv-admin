const { isDevelopMode } = require("../../config/config")

/**
 * 发送post请求
 * @param {String} url 请求的url
 * @param {String} data 请求的body
 * @returns {Promise}
 */
function post(url, data) {
    return fetch(url, {
        method: "POST",
        headers: {
            "content-type": "text/plain"
        },
        body: data,
        credentials: isDevelopMode ? "include" : "same-origin"
    })
}

export default post