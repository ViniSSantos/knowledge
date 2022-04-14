const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const article = { ...req.body }
        if (req.params.id) article.id = req.params.id

        try {
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch (msg) {
            res.status(400).send(msg)
        }

        if (article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)
            }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10 //usado para artigos por paginção
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('articles').count('id').first() //.count(para contar) e . first(para pegar o primeiro) 
        const count = parseInt(result.count) // parseInt(para que sejá de fato inteiro, pois vem como string)

        app.db('articles')
            .select('id', 'name', 'description') // select(para pegar/consultar)
            .limit(limit).offset(page * limit - limit) //para iniciar da zero .offset(à partir de onde ira fazer o "DESLOCAMENTO")
            .then(articles => res.json({ data: articles, count, limit })) //.then(pega de artigos e retorna)
            .catch(err => res.status(500).send(err)) // .catch(para cospir a rejeição nesse caso "err")
    }

    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first() //pega primeiro elemento array
            .then(article => {
                article.content = article.content.toString() //o article.content retorna em numeral, usamos .toString(para converter em string "texto")
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'}) // criou-se um apelido para cada tabela
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name'}) //usando duas tabelas pra preencher a informação 
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc') // .orderBy(para ordenar)
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}