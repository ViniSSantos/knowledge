
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull().unique() //Unique = Unico
        table.string('password').notNull()
        table.boolean('admin').notNull().defaultTo(false) //default To = default = predefinido. To = para. DefaultTo = Padrão para.
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users')
};
