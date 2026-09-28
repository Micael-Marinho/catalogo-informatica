module.exports = (sequelize, Sequelize) => {
    const Vendedor = sequelize.define('vendedor', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        nome: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Vendedor;
};