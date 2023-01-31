const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const mysql = require('mysql2')

const app = express();
const path = require('path');
const url = require('url');
const db = require('./models/db.js');


const Sequelize = require('sequelize');
const { sequelize } = require('./models/db.js');
const Nastavnik = require('./models/Nastavnik.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, '/public/html')));
app.use('/', express.static(path.join(__dirname, '/public/css')));
app.use('/', express.static(path.join(__dirname, '/public/js')));
app.use('/', express.static(path.join(__dirname, '/public/scripts')));
app.use('/', express.static(path.join(__dirname, '/public/images')));
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: 'neka tajna sifra',
    resave: true,
    saveUninitialized: true
 }));

app.post("/login", (req, res) => {
    db.nastavnik.findOne({where:{username: req.body.username}}).then((nastavnik) => {
        if(nastavnik == null) {
            res.json({poruka : "Neuspjesna prijava"})
        } else {
            bcrypt.compare(req.body.password, nastavnik.password_hash, (err, odg) => {
                if(odg == true && err == null) {
                //dodati u sesiju
                    req.session.username = req.body.username
                    db.predmet.findAll({where:{nastavnikId: nastavnik.id}}).then((predmeti) => {
                        let predmetiLista = []
                        for(var i = 0; i < predmeti.length; i++) {
                            predmetiLista.push(predmeti[i].dataValues.predmet);
                        }                        
                        req.session.predmeti = predmetiLista;
                        console.log("unseseni predmeti", req.session.predmeti)
                    })
                    res.json({poruka : "Uspjesna prijava"})
                    
                } 
                else {
                    console.log("ovdje belaj")
                    res.json({poruka : "Neuspjesna prijava"})
                    
                } 
            })
        }
    })     
            
})
app.post("/logout", (req,res) => {
    //obrisati iz sesije
    req.session.username = null
    req.session.predmeti = null
    res.json("Logout")
})

app.get("/predmeti.html", (req,res) => {
    //pronalazak nastavnika
    if(req.session.username == null) {

    } else {
        db.nastavnik.findOne({where:{username: req.session.username}}).then((nastavnik) => {
            var nastavnikovId = nastavnik.id
            db.predmet.findAll({where:{nastavnikId: nastavnikovId}}).then((predmeti) => {
                var predmetiNastavnika = "<html><body>"
                predmetiNastavnika += "<link rel=" + "stylesheet" + " type=" + "text/css"  + " href=" + "prisustvo.css" + ">"
                for(var i = 0; i < predmeti.length; i++) {
                    predmetiNastavnika += "<button onclick=" + "openPredmet(this)>" + predmeti[i].predmet + "</button>"
                }  
                predmetiNastavnika += "<button onclick=" + "logout()" + ">" +  "Logout" + "</button>"
                predmetiNastavnika += "<div id = tabela></div>"
                predmetiNastavnika += "<script src = " + "poziviAjax.js" + "> </script>"
                predmetiNastavnika += "<script src = " + "logout.js" + "> </script>"
                predmetiNastavnika += "<script src = " + "openPredmet.js" + "> </script>"
                predmetiNastavnika += "<script src = " + "clickHandler.js" + "> </script>"
                predmetiNastavnika += "<script src = " + "TabelaPrisustvo.js" + "> </script>"
                predmetiNastavnika += "</body></html>"
                res.send(predmetiNastavnika)
            })
        })
    }
})

app.get("/predmeti", (req,res) => {
    if(req.session.username == null) {
        res.json({greska : "Nastavnik nije loginovan"})
    }
    else {
         db.nastavnik.findOne({where:{username: req.session.username}}).then((nastavnik) => {
            var nastavnikovId = nastavnik.id
            db.predmet.findAll({where:{nastavnikId: nastavnikovId}}).then((predmeti) => {
        res.json({predmeti: predmeti})
            })})
    }
})

app.get("/predmet/:NAZIV", (req,res) => {
var predmet;
var brojPredSed;
var brojVjeSed;
var prisustvaObjekat = [];
var studentiObjekat = [];
db.predmet.findOne({where: {predmet: req.params.NAZIV}})
.then((nadjenPredmet) => {
    predmet = nadjenPredmet.predmet;
    brojPredSed = nadjenPredmet.brojPredavanjaSedmicno;
    brojVjeSed = nadjenPredmet.brojVjezbiSedmicno;
  return nadjenPredmet.get();
})
.then(predmet => {
  return db.prisustvo.findAll({where: {predmetId: predmet.id}})
})
.then(nadjenoPrisustvo => {
    console.log(nadjenoPrisustvo)
    //for petljom unijeti prisustva
    for(var i = 0; i < nadjenoPrisustvo.length; i++) {
        prisustvaObjekat.push({sedmica:nadjenoPrisustvo[i].sedmica, index:nadjenoPrisustvo[i].dataValues.index, predavanja:parseInt(nadjenoPrisustvo[i].dataValues.predavanja), vjezbe:parseInt(nadjenoPrisustvo[i].dataValues.vjezbe)})
    }
    return nadjenoPrisustvo;
})
.then( async (prisustvo) => {
    //for petljom unijeti studente
    for(var i = 0; i < prisustvo.length; i++) {
        const s = await db.student.findOne({where: {index: prisustvo[i].dataValues.index}})       
        studentiObjekat.push({ime: s.dataValues.ime, index: s.dataValues.index})
    }
        
    studentiObjekat = studentiObjekat.filter((value, index, self) =>
    index === self.findIndex((t) => (
    t.ime === value.ime && t.index === value.index
  ))
)
    var podaci = {predmet:predmet, brojPredavanjaSedmicno:brojPredSed, brojVjezbiSedmicno:brojVjeSed, prisustva:prisustvaObjekat, studenti:studentiObjekat}
    
    res.json({prisustva:podaci})
  return prisustvo
})


})

app.post("/prisustvo/predmet/:NAZIV/student/:index", (req,res) => {
    var sedmica = req.body.sedmica;
    var brPredavanja = req.body.predavanja;
    var brVjezbi = req.body.vjezbe;
    req.params.index = parseInt(req.params.index)
    // lalallalla
    var predmet;
    var brojPredSed;
    var brojVjeSed;
    var prisustvaObjekat = [];
    var studentiObjekat = [];
    db.predmet.findOne({where: {predmet: req.params.NAZIV}})
    .then((nadjenPredmet) => {
        predmet = nadjenPredmet.predmet;
        brojPredSed = nadjenPredmet.brojPredavanjaSedmicno;
        brojVjeSed = nadjenPredmet.brojVjezbiSedmicno;
    return nadjenPredmet.get();
    })
    .then(predmet => {
    return db.prisustvo.findAll({where: {predmetId: predmet.id}})
    })
    .then(nadjenoPrisustvo => {
    //for petljom unijeti prisustva
    for(var i = 0; i < nadjenoPrisustvo.length; i++) {
        prisustvaObjekat.push({sedmica:nadjenoPrisustvo[i].sedmica, index:nadjenoPrisustvo[i].dataValues.index, predavanja:parseInt(nadjenoPrisustvo[i].dataValues.predavanja), vjezbe:parseInt(nadjenoPrisustvo[i].dataValues.vjezbe), predmetId: nadjenoPrisustvo[i].dataValues.predmetId})
    }

    return prisustvaObjekat;
    })
    .then( async (prisustvo) => {
        //for petljom unijeti studente
        for(var i = 0; i < prisustvo.length; i++) {
            const s = await db.student.findOne({where: {index: prisustvo[i].index}})       
            studentiObjekat.push({ime: s.dataValues.ime, index: s.dataValues.index})
        }
            
        studentiObjekat = studentiObjekat.filter((value, index, self) =>
        index === self.findIndex((t) => (
        t.ime === value.ime && t.index === value.index
    ))
)

            var podaci = {predmet:predmet, brojPredavanjaSedmicno:brojPredSed, brojVjezbiSedmicno:brojVjeSed, prisustva:prisustvo, studenti:studentiObjekat}
            
            // lalallal
            console.log("ISPISI INDEX: ",req.params.index)
            var prisustva=podaci.prisustva
            var pomocna = 0;
            var np = 13
            for(var j = 0; j < prisustva.length; j++) {
                if(prisustva[j].index == req.params.index && prisustva[j].sedmica == sedmica) {
                    pomocna = 1;
                    prisustva[j].predavanja = brPredavanja;
                    console.log(brPredavanja)
                    prisustva[j].vjezbe = brVjezbi;
                    //lalallala
                    db.prisustvo.update({sedmica: sedmica, predavanja: brPredavanja, vjezbe: brVjezbi, index: req.params.index, predmetId: prisustva[j].predmetId}, {where: {sedmica: sedmica, index: req.params.index, predmetId: prisustva[j].predmetId}})
                    // allalala
                    break;
                }
            }
            if(pomocna == 0) {
                prisustva.push({sedmica: sedmica,predavanja: brPredavanja,vjezbe: brVjezbi,index: req.params.index})
                 //lalallala
                 db.prisustvo.create({sedmica: sedmica, predavanja: brPredavanja, vjezbe: brVjezbi, index: req.params.index, predmetId: prisustva[0].predmetId})
                 // allalala
            }
            var dodatnoPrisustvo=podaci
            
            res.json({prisustva: dodatnoPrisustvo})

     
})
})

app.listen(3000, () => {
    console.log("Otvoren port")
})

/*
bcrypt.hash("PASSWORDHASH", 10, function(err, hash) {
       // hash šifre imate ovdje
});*/

