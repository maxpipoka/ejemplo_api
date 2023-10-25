
// Middleware que construye el body en req de tipo post y patch
function makeBody(req, res, next){
    if ((req.method !== 'POST') && (req.method !== 'PATCH')) { return next()}

    if (req.headers['content-type'] !== 'application/json') { return next()}

    let bodyTemporal = ''

    req.on('data', (chunk) => {
        bodyTemporal += chunk.toString()
    })

    req.on('end', () => {
        req.body = JSON.parse(bodyTemporal)

        next()
})
}

export default makeBody

