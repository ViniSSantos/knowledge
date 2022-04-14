
exports.up = function(knex, Promise) { //Alterar a tabela criando uma coluna
  return knex.schema.alterTable('users', table => {
      table.timestamp('deletedAt')
  })
};

exports.down = function(knex, Promise) { // Alterar a tabela excluindo uma coluna (O que eu faço em Up, desfaço em down).
  return knex.schema.alterTable('users', table => {
      table.dropColumn('deletedAt')
  })
};
