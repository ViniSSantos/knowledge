const { authSecret } = require('../.env') // Para ler o token e ver se está correto
const passport = require('passport') //Framwork de validação - google, face...
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt //precisamos extrair o token jwt da requisição

module.exports = app => {
    const params = { //o primeiro parametro aqui que deve ser chamado é o segredo "authSecret" chamamos de secretOrKey
        secretOrKey: authSecret, //"authSecret" contem o segredo pra desvendar o token
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() //para obter usamos esta função "Bearer(portador)" do Header da requisição
    }

    const strategy = new Strategy(params, (payload, done) => { 
        app.db('users') //Para obter usuario
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false)) // err nulo e se o user estiver setado vai retornar false vai pegar o "...payload"
            .catch(err => done(err, false))
    })

    passport.use(strategy) // aqui chama o que aplicar

    return {
        authenticate: () => passport.authenticate('jwt', { session: false }) // aqui usa o "jwt" de estratégia e não controla sessão
    }

}