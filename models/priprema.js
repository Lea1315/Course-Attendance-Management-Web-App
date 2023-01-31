const db = require('./db.js')
db.sequelize.sync({force:true}).then(function(){
    console.log("cao")
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija(){
    var studenti=[];
    var predmeti=[];
    var nastavnici=[];
    var prisustva=[];
    return new Promise(function(resolve,reject){
    studenti.push(db.student.create({ime:'Lea Jesenkovic', index: 12345}));
    studenti.push(db.student.create({ime:'Azra Krehic', index: 12351}));
    Promise.all(studenti).then(function(s){
        var leaJ=s.filter(function(a){return a.dataValues.ime==='Lea Jesenkovic'})[0];
        var azraK=s.filter(function(a){return a.dataValues.ime==='Azra Krehic'})[0];    
        predmeti.push(
            db.predmet.create({predmet:'RPR', brojPredavanjaSedmicno:3, brojVjezbiSedmicno: 2}).then(function(k){
                k.setStudenti([leaJ, azraK]);
                //ovdje
                prisustva.push(
                    db.prisustvo.create({sedmica:1, predavanja:2, vjezbe: 1, index: 12345, predmetId: k.dataValues.id}).then(function(p){
                        p.setStudenti([leaJ]);
                        return new Promise(function(resolve,reject){resolve(p);});
                    })
                );prisustva.push(
                    db.prisustvo.create({sedmica:2, predavanja:2, vjezbe: 1, index: 12345, predmetId: k.dataValues.id}).then(function(p){
                        p.setStudenti([leaJ]);
                        return new Promise(function(resolve,reject){resolve(p);});
                    })
                );

                prisustva.push(
                    db.prisustvo.create({sedmica:2, predavanja:2, vjezbe: 1, index: 12351, predmetId: k.dataValues.id}).then(function(p){
                        p.setStudenti([azraK]);
                        return new Promise(function(resolve,reject){resolve(p);});
                    })
                );
                return new Promise(function(resolve,reject){resolve(k);});
            })
        );
        predmeti.push(
            db.predmet.create({predmet:'ASP', brojPredavanjaSedmicno:4, brojVjezbiSedmicno: 3}).then(function(k){
                k.setStudenti([leaJ, azraK]);
                //ovdje
                prisustva.push(
                    db.prisustvo.create({sedmica:1, predavanja:2, vjezbe: 1, index: 12345, predmetId: k.dataValues.id}).then(function(p){
                        p.setStudenti([leaJ, azraK]);
                        return new Promise(function(resolve,reject){resolve(p);});
                    })
                );
                prisustva.push(
                    db.prisustvo.create({sedmica:2, predavanja:2, vjezbe: 1, index: 12351, predmetId: k.dataValues.id}).then(function(p){
                        p.setStudenti([azraK, leaJ]);
                        return new Promise(function(resolve,reject){resolve(p);});
                    })
                );
                return new Promise(function(resolve,reject){resolve(k);});
            })
        );
        Promise.all(predmeti).then(function(predmeti){
            var rpr=predmeti.filter(function(k){return k.predmet==='RPR'})[0];
            var asp=predmeti.filter(function(k){return k.predmet==='ASP'})[0];
            
            nastavnici.push(
                db.nastavnik.create({username:'Lea', password_hash: "$2b$10$Af2DjO0wfzQDT/vg/ucKKeDzFmOnNPFkH.qkqOlytM1KsKtAfymqa"}).then(function(b){
                    console.log("vratio nastavnika: ", b)
                    return b.setPredmetiNastavnika([rpr,asp]).then(function(){
                        
                    return new Promise(function(resolve,reject){resolve(b);});
                    });
                })
            );
            Promise.all(nastavnici).then(function(b){resolve(b);}).catch(function(err){console.log("Nastavnik greska "+err);});
        }).catch(function(err){console.log("Predmet greska "+err);});
    }).catch(function(err){console.log("Student greska "+err);});   

    });
}