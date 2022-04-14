// Não preciso mais importar no consign pois le a pasta api toda.
module.exports = app => {
    const Stat = app.mongoose.model('Stat', { //Passamos o modelo, do que buscar 
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    const get = (req, res) => { //Acessar o mongo através do Stat, busca com .findOne
        Stat.findOne({}, {}, {sort: { 'createdAt' : -1 } }) //param = {n filtrar nada}, {n selec. atributo}, e a partir de sort: { vai pegar a ultia statistica cadastrada no mongodb "-1=decrescente"}
            .then(stat => {
                const defaultStat = { 
                    users: 0,
                    categories: 0,
                    articles: 0
                }
                res.json(stat || defaultStat) //Caso o que recebo do banco ñ seja estatis. válida, trá o "defaultStat" zerado.
            })
    }

    return { Stat, get }
}