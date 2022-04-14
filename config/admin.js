module.exports = middleware => {
    return (req, res, next) => {
        if (req.user.admin) { // Se for adm, retorne...
            middleware(req, res, next)
        } else {
            res.status(401).send('Usário não é administrador') // caso não seja adm
        }
    }
}