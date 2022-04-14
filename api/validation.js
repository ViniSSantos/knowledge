module.exports = app => {
    function existsOrError(value, msg) { // Se existe valor ou não
        if(!value) throw msg //Se o valor não esta setado
        if(Array.isArray(value) && value.length === 0) throw msg //Se o valor é array e se está vazio, considera não existe
        if(typeof value === 'string' && !value.trim()) throw msg // Se é do tipo string, se estiver em branco, considera ela como ñ existindo.
    }
    
    function notExistsOrError(value, msg) { // Se não existir ok, se existir erra com msg
        try {
            existsOrError(value, msg) // Se não der erro, lança o erro abaixo
        } catch(msg) {
            return
        }
        throw msg
    }
    
    function equalsOrError(valueA, valueB, msg) {
        if(valueA !== valueB) throw msg // Se a for diferente de B, lança msg
    }

    return { existsOrError, notExistsOrError, equalsOrError}
}
//Usamos funções simples como: existe, não existe ou é igual
//Poderia ter outros como: valid id, valid e-mail, valid password(com regras S:"Mm298*"), enfim...
