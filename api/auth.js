const { authSecret } = require('../.env')
const jwt = require('jwt-simple') //Será nosso token
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => { //função middleware(req, res)
        if (!req.body.email || !req.body.password) { // validando o email e senha que vem nody da requisição 
            return res.status(400).send('Informe usuário e senha!') // Se nenhum estiver presente, saí do método, retornando o erro.
        }

        const user = await app.db('users') // Se estiver vindo email, vamos buscar no Banco Dados
            .where({ email: req.body.email }) //.where(onde) email. do corpo da requisição
            .first() // Pega o usuário

        if (!user) return res.status(400).send('Usuário não encontrado!') // Se usuário não existir, traga o erro

        const isMatch = bcrypt.compareSync(req.body.password, user.password) //.compareSync(comparando a senha crua do body com a senha do user já com a hash)
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!') // Se não combinar(isMatch) retorna erro.

        const now = Math.floor(Date.now() / 1000) //formula para pegar a data de agora, valor em segundos para o tokem

        const payload = { //Aqui é o conteúdo do meu jwt o que vai conter dentro dele
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            ait: now,           //ait = sigla para emitido em... assuied at
            exp: now + (60 * 60 * 24 * 3) // seg * min * hrs * dia
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret) //Codificamos o payload à partir do authSecret
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null // caso o body não venha setado será de valor Nulo.
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret) // Se estiver setado, ira realizar a decodificação do token
                if(new Date(token.exp * 1000) > new Date()) { //Se a data do token for maior que a data atual, sig que o token está válido
                    return res.send(true) //Token está válido
                }
            }
        } catch(e) {
            // Para um suposto problema com o token
        }

        res.send(false) // Para caso de o token estar inválido
    }

    return { signin, validateToken }
}
