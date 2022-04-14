// função que ira exportar os métodos abaixo, func. arrow recebe de parâmetro o app.
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => { //Encriptando a senha, entregando um "hash"
        const salt = bcrypt.genSaltSync(10) //Temos que gerar o sal o tempero do "hash"
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body } // Mandamos um json q representa o usuário / clonou o body com o {destruct}
        if(req.params.id) user.id = req.params.id  // Ele verifica no param. da req. se tem o id.

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false 

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senhã não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, 
                'Senhas não conferem')
            
            const userFromDB = await app.db('users') // db é o meu Knex como eu acesso ele
                .where({ email: user.email }).first() // Onde ele se baseia, e qual ele pega
            if(!user.id) { //Só faça essa validação se o user.id não foi setado
                notExistsOrError(userFromDB, 'Usuário já cadastrado') // Se não existir, erro
            }
        } catch(msg) {
            return res.status(400).send(msg) //Erro 400 provem de qm faz a requisição(cliente), encia um send. mesg de erro
        } //acaba aqui as validações

        user.password = encryptPassword(user.password) //solicita a encriptação da senha do usuario
        delete user.confirmPassword

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send()) //204, é tudo certo, mas sem algo pra retornar
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users') 
                .insert(user)// Caso o id não seja informado, ele ira inserir
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
    const get = (req, res) => { //Aqui o get é responsavel por obter todos os usuários
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users)) //Se os usuários vierem de forma correta, chama o res.json(users)
            .catch(err => res.status(500).send(err)) // caso não tenha dado cero, enviar o erro
    }
    const getById = (req, res) => { //Aqui o get é responsavel por obter um único usuário
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user)) 
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => { // Checar se tem artigo no usuario
        try {
            const articles = await app.db('articles') //Checar os artigos no banco
                .where({ userId: req.params.id }) //Pego o id que recebi no param da req. e checo em todos os artigos por userId
            notExistsOrError(articles, 'Usuário possui artigo.') //Se possuir artigo cadastrado traga o erro.

            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date()}) // Passando nova data
                .where({ id: req.params.id }) // filtrando: 
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}