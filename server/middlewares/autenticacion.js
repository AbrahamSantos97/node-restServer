const jwt = require('jsonwebtoken');
let verifyToken = (req, res, next) => {
    let tok = req.get('token');
    jwt.verify(tok, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

let verificaAdminRole = (req, res, next) => {
    let user = req.usuario;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            error: 'Nel'
        });
    }
}

module.exports = {
    verifyToken,
    verificaAdminRole

}