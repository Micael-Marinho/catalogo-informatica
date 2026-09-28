module.exports = (sequelize, Sequelize) => {
    const Produto = sequelize.define('produto', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },

        descricao: {
            type: Sequelize.TEXT
        },

        preco: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },

        categoriaId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        vendedorId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return Produto;
};