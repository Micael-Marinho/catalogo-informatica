// Carrega o Sequelize.
const Sequelize = require('sequelize');

// Configura a conexão com o PostgreSQL.
const sequelize = new Sequelize(
    'catalogo_informatica',
    'postgres',
    'SUA_SENHA_AQUI',
    {
        host: 'localhost',
        port: 5432,
        dialect: 'postgres'
    }
);

// Organiza os recursos que serão usados pelo projeto.
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Carrega os três models.
db.Categoria = require('../models/categoria')(sequelize, Sequelize);
db.Vendedor = require('../models/vendedor')(sequelize, Sequelize);
db.Produto = require('../models/produto')(sequelize, Sequelize);

// Uma categoria possui vários produtos.
db.Categoria.hasMany(db.Produto, {
    foreignKey: 'categoriaId',
    onDelete: 'RESTRICT'
});

// Cada produto pertence a uma categoria.
db.Produto.belongsTo(db.Categoria, {
    foreignKey: 'categoriaId',
    onDelete: 'RESTRICT'
});

// Um vendedor possui vários produtos.
db.Vendedor.hasMany(db.Produto, {
    foreignKey: 'vendedorId',
    onDelete: 'RESTRICT'
});

// Cada produto pertence a um vendedor.
db.Produto.belongsTo(db.Vendedor, {
    foreignKey: 'vendedorId',
    onDelete: 'RESTRICT'
});

module.exports = db;