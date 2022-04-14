const mongoose = require('mongoose') // Bilblioteca orientada a obejtos ("Mapeamento Objeto documento") cria conexão com o MongoDB
mongoose.connect('mongodb://localhost/knowledge_stats', { useNewUrlParser: true}) // Este segundo paramentro passamos por convenção para um bom funcionanmento da conexão, mesmo assim gerou uns avisos chatos no terminal
    .catch(e => {
        const msg = 'ERRO! Não foi possível conectar com o MongoDB!'
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m') // Colocamos um bacground red no alerta de erro, seg.pram. é para finalizar a cor.
    })