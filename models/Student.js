const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Student = sequelize.define('student', {
        index: Sequelize.INTEGER,
        ime: Sequelize.STRING
    });
    return Student;
}