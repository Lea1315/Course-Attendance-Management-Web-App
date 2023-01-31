const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Prisustvo = sequelize.define('prisustvo', {
        sedmica: Sequelize.INTEGER,
        predavanja: Sequelize.INTEGER,
        vjezbe: Sequelize.INTEGER,
        index: Sequelize.INTEGER
    });
    return Prisustvo;
}