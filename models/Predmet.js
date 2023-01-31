const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Predmet = sequelize.define('predmet', {
        predmet: Sequelize.STRING,
        brojPredavanjaSedmicno: Sequelize.INTEGER,
        brojVjezbiSedmicno: Sequelize.INTEGER
    });
    return Predmet;
}