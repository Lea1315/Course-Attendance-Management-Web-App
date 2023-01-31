const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt22', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
     max: 5,
     min: 0,
     acquire: 30000,
     idle: 10000
   }
 });
const db={};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.prisustvo = require(__dirname+'/Prisustvo.js')(sequelize);
db.nastavnik = require(__dirname+'/Nastavnik.js')(sequelize);
db.predmet = require(__dirname+'/Predmet.js')(sequelize);
db.student = require(__dirname+'/Student.js')(sequelize);

//relacije
db.nastavnik.hasMany(db.predmet,{as:'predmetiNastavnika'});

db.studentPredmeta=db.predmet.belongsToMany(db.student,{as:'studenti',through:'student_predmeta',foreignKey:'predmetId'});
db.student.belongsToMany(db.predmet,{as:'predmeti',through:'student_predmeta',foreignKey:'studentId'});
db.predmet.hasMany(db.prisustvo)

db.prisustvoStudenta=db.student.belongsToMany(db.prisustvo,{as:'prisustva',through:'prisustvo_student',foreignKey:'prisustvoId'});
db.prisustvo.belongsToMany(db.student,{as:'studenti',through:'prisustvo_student',foreignKey:'studentId'});


module.exports=db;
/*
//POVEZAN NASTAVNIK SA PREDMETOM
db.nastavnik.hasMany(db.predmet, { as: "predmeti" });
db.predmet.belongsTo(db.nastavnik, {
    foreignKey: "nastavnikUsername",
    as: "nastavnik",
});
db.predmet.hasMany(db.prisustvo, {as: "prisustva"});
db.predmet.hasMany(db.student, {as: "studenti"});

//POVEZAN PREDMET SA PRISUSTVOM
db.predmet.hasMany(db.prisustvo, { as: "prisustva" });
db.prisustvo.belongsTo(db.predmet, {
    foreignKey: "predmetNaziv",
    as: "predmet",
});

//POVEZANO PRISUSTVO SA STUDENTOM
db.prisustvo.hasMany(db.student, { as: "studenti" });
db.student.belongsTo(db.prisustvo, {
    foreignKey: "prisustvoSedmica",
    as: "prisustvo",
});
*/
/*
db.nastavnik.create({
    username: "Lea",
    password_hash: "$2b$10$Af2DjO0wfzQDT/vg/ucKKeDzFmOnNPFkH.qkqOlytM1KsKtAfymqa",
})

db.predmet.create({
    predmet: "RPR",
    brojPredavanjaSedmicno: 3,
    brojVjezbiSedmicno: 2,
    nastavnikUsername: "Lea",
})

db.predmet.create({
    predmet: "ASP",
    brojPredavanjaSedmicno: 3,
    brojVjezbiSedmicno: 2,
    nastavnikUsername: "Lea",
})

db.prisustvo.create({
    sedmica: 1,
    predavanja: 3,
    vjezbe: 2,
    index: 12345,
    predmetId: 1,
})

db.student.create({
    index: 12345,
    ime: "Lea Jesenkovic",
    predmetId: 1,
})
db.student.create({
    index: 12513,
    ime: "Azra Krehic",
    predmetId: 1,
})

module.exports = db; 
*/

