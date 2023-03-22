const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(403).json({
            message: "A token is required for authentication"
        });
    } else {
        try {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const decoded = jwt.verify(bearerToken, process.env.JWT_KEY);
            // console.log(bearerToken, decoded)

            req.token = bearerToken;
            req.userData = decoded;

            return next();
        } catch (err) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
    }
};