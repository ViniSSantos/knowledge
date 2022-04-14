const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1****', async function () {
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        const { Stat } = app.api.stat // importou o stat a partir do destructor o modelo de app aqui

        const lastStat = await Stat.findOne({}, {},
            { sort: {'createdAt' : -1 } })

        const stat = new Stat({ // aqui está os valores setados do modelo stat
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users // testando ChageUsures, se a lastStat(ult. statistica) não estiver setada ou é diferente de "lastStat.users"
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles

        if(changeUsers || changeCategories || changeArticles) {
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas!')) // irá percistir lá no mongodb e ira mostrar "etc..."
        }
    })
}