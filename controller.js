
exports.init = (req, res) => {

    const sessionId = req.cookies['NODEJSSESSION'];

    if (sessionId) {

        res.sendFile('static/home.html', {root: __dirname});

    } else {

        res.sendFile('static/login.html', {root: __dirname});
    }
};

exports.callBack = (req, res) => {

    const authCode = req.query.code;

    obtainAccessToken(authCode).then(function (token) {
        accessToken = token;
        let session = uuid1();
        res.setHeader('Set-Cookie', [`NODEJSSESSION=${session}`]);
        res.sendFile('static/home.html', {root: __dirname});
    }).catch(function (err) {
        res.sendFile('static/login.html', {root: __dirname});
    })
};

exports.getPost = (req, res) => {

    let options = {
        method: 'GET',
        uri: _config.GRAPH_API,
        headers: {
            "Authorization": "Bearer ".concat(accessToken)
        }
    };

    rp(options)
        .then(function (body) {
            res.json(body);
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}

exports.logout = (req, res) => {

    res.clearCookie('NODEJSSESSION');
    res.sendFile('static/login.html', {root: __dirname});
}

function obtainAccessToken (code) {

    return new Promise(function (resolve, reject) {

        const authStr = _config.APP_ID.concat(":").concat(_config.SECRET);

        let options = {
            method: 'POST',
            uri: _config.ACCESS_TOKEN_URL,
            body: {
                grant_type: "authorization_code",
                client_id: _config.APP_ID,
                redirect_uri: _config.REDIRECT_URL,
                code: code.concat("#_=_")
            },
            json:true,
            headers: {
                "Authorization": "Basic ".concat(base64encode(authStr))
            }
        };

        rp(options)
            .then(function (body) {
                resolve(body.access_token);
            }).catch(function (err) {
            reject(err);
        })

    })
}
