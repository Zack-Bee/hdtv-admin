export default (url, data) => {
    return fetch(url, {
        method: "POST",
        headers: {
            "content-type": "text/plain"
        },
        body: data,
    })
}