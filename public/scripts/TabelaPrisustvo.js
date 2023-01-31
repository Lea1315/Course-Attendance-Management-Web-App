let TabelaPrisustvo = function (divRef, podaci) {
    //provjera da li je prazan div
    if (divRef.childNodes.length != 0) divRef.innerHTML = '';
    var trenutnaSedmica = BrojUnesenihSedmica(podaci); 
    //funkcija za provjeru ispravnih podataka
    function IspravniPodaci(podaci) {
        var list=[];
        var ispravno = 1;
        let i = 0;
        
        //4)vise studenata sa istim indexom   
        podaci.studenti.forEach(student => { 
            if(list.includes(student.index)) {
                ispravno = 0;
            } else { 
            list.push(student.index);
            }
        });
        //2)broj prisustva manji od 0
        podaci.prisustva.forEach(prisustvo => {
            if(prisustvo.predavanja < 0 || prisustvo.vjezbe < 0) ispravno = 0;
        });
        
        //5)postoji prisustvo za studenta koji nije u lisi
        podaci.prisustva.forEach(prisustvo => {
            if(!list.includes(prisustvo.index)) ispravno = 0;
        });
        //1)broj prisustva veci od broja predavanja i vjezbi sedmicno
        podaci.prisustva.forEach(prisustvo => {
            if(prisustvo.predavanja > podaci.brojPredavanjaSedmicno) ispravno = 0;
            if(prisustvo.vjezbe > podaci.brojVjezbiSedmicno) ispravno = 0;
        });
        //6)postoji sedmica da nema prisustvo izmedju dvije koje imaju
        podaci.prisustva.sort((a, b) => (a.sedmica > b.sedmica) ? 1 : -1);
        while(podaci.prisustva[i].sedmica < BrojUnesenihSedmica(podaci)) {
            if(podaci.prisustva[i+1].sedmica - podaci.prisustva[i].sedmica != 1 && podaci.prisustva[i+1].sedmica - podaci.prisustva[i].sedmica != 0) {
                ispravno = 0;
                break;
            }
            i++;
        }
        //3)isti student ima dva ili vise unosa prisustva za istu sedmicu
        i = 0;
        for(i = 0; i < podaci.prisustva.length - 1; i++) {
            for(let j = i+1; j < podaci.prisustva.length; j++) {
                if(podaci.prisustva[i].sedmica == podaci.prisustva[j].sedmica && podaci.prisustva[i].index == podaci.prisustva[j].index) ispravno = 0;
            }
        }
    
        return ispravno;
    }
    // funkcija koja vraca broj zadnje unesene sedmice
    function BrojUnesenihSedmica(podaci) {
        let brojUnesenihSedmica = 0;
        podaci.prisustva.forEach(prisustvo => {
            if(prisustvo.sedmica > brojUnesenihSedmica) brojUnesenihSedmica = prisustvo.sedmica;
        });
        return brojUnesenihSedmica;
    }

    //KREIRANJE TABELE
    function IscrtajTabelu(trenutnaSedmica) {
        
        let headers = ['Ime i prezime', 'Index'];
        if(IspravniPodaci(podaci) == 0) {
            let naslov = document.createElement('h2');   
            let neispravniPodaci = document.createTextNode("Podaci o prisustvu nisu validni!");
            naslov.appendChild(neispravniPodaci);
            divRef.appendChild(naslov);
        } 
        else {
        var brojUnesenihSedmica = BrojUnesenihSedmica(podaci);
        //kreiranje naslova
        let naslov = document.createElement('h2');
        let imePredmeta = document.createTextNode(podaci.predmet);
        naslov.appendChild(imePredmeta);
        divRef.appendChild(naslov);
        
        //kreiranje headera
        let table = document.createElement('table');
        let headerRow = document.createElement('tr');

        headers.forEach(headerText => {
            let header = document.createElement('th');
            let textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        });    
        for(let i = 1; i <= brojUnesenihSedmica; i++) {
            let header = document.createElement('th');
            let textNode = document.createTextNode(i);
            if(i == trenutnaSedmica) header.colSpan = podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno;
            header.appendChild(textNode);
            headerRow.appendChild(header);
        }
        //kreiranje spojenih preostalih kolona
        if(BrojUnesenihSedmica(podaci) != 15) {
            let header = document.createElement('th');
            let textNode;
            if(BrojUnesenihSedmica(podaci) <= 13) {
                textNode = document.createTextNode(BrojUnesenihSedmica(podaci)+1 + "-" + 15);
                header.colSpan = 15-BrojUnesenihSedmica(podaci);
            }
            else textNode = document.createTextNode(15);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        }
        
        table.appendChild(headerRow);
        //popunjavanje tabele
        podaci.studenti.forEach(student => {
            let row = document.createElement('tr');
            let row2;
            //popunjavanje imena i indexa
            Object.values(student).forEach(text => {
                let cell = document.createElement('td');
                //
                
                //
                cell.rowSpan = 2;
                let textNode = document.createTextNode(text);
                cell.appendChild(textNode);        
                row.appendChild(cell);
            });
            //popunjavanje celija 
            for(let i = 1; i <= brojUnesenihSedmica + 1; i++) {   
                var brojPrisustvaPredavanjima;
                var brojPrisustvaVjezbama;  
                var p;       
                //popunjavanje detaljne sedmice
                if(i == trenutnaSedmica) {
                    for(let j = 1; j <= podaci.brojPredavanjaSedmicno; j++) {
                        let cell = document.createElement('td');
                        let textNode = document.createTextNode("p"  + j);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    }
                    for(let j = 1; j <= podaci.brojVjezbiSedmicno; j++) {
                        let cell = document.createElement('td');
                        let textNode = document.createTextNode("v" + j);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    }
                    //popunjavanje prisustva bojama
                    row2 = document.createElement('tr');       
                    for(let j = 1; j <= podaci.brojPredavanjaSedmicno; j++) {                       
                        let cell = document.createElement('td');                     
                        brojPrisustvaPredavanjima = 0;  
                        var studentuUnesenoPrisustvo = 0; 
                        var varijabla1 = 0
                        podaci.prisustva.forEach(prisustvo => {
                            
                            if(prisustvo.index == student.index && prisustvo.sedmica == i)  {
                                brojPrisustvaPredavanjima = prisustvo.predavanja;
                                varijabla1 = prisustvo.vjezbe;
                                studentuUnesenoPrisustvo = 1;       
                            }           
                        });
                        if(studentuUnesenoPrisustvo == 0) {
                            function clickHandler() {               
                                p.vjezbe = 0;
                                p.predavanja = 1;
                                p.sedmica = trenutnaSedmica;
                                p.index = student.index;
                                podaciUpdate(podaci.predmet, student.index,p);
                            }
                            cell.addEventListener('click', clickHandler);
                            cell.style.backgroundColor = "white";
                        }
                        else {                                     
                            if(j <= brojPrisustvaPredavanjima) {
                                function clickHandler() {               
                                    p.vjezbe = varijabla1;
                                    p.predavanja = brojPrisustvaPredavanjima - 1;
                                    p.sedmica = trenutnaSedmica;
                                    p.index = student.index;
                                    podaciUpdate(podaci.predmet, student.index,p);
                                }
                                cell.addEventListener('click', clickHandler);
                                cell.style.backgroundColor = "#80d800";
                            }
                            else {
                                function clickHandler() {               
                                    p.vjezbe = varijabla1;
                                    p.predavanja = brojPrisustvaPredavanjima + 1;
                                    p.sedmica = trenutnaSedmica;
                                    p.index = student.index;
                                    podaciUpdate(podaci.predmet, student.index,p);
                                }
                                cell.addEventListener('click', clickHandler);
                                cell.style.backgroundColor = "red";
                            }
                        }
                        let textNode = document.createTextNode("");
                        cell.appendChild(textNode);                        
                        row2.appendChild(cell);
                    }               
                    for(let j = 1; j <= podaci.brojVjezbiSedmicno; j++) {
                        let cell = document.createElement('td');   
                         
                        brojPrisustvaVjezbama = 0;   
                        let studentuUnesenoPrisustvo = 0;
                        let varijabla = 0; 
                        podaci.prisustva.forEach(prisustvo => {
                            p = prisustvo
                            if(prisustvo.index == student.index && prisustvo.sedmica == i)  {
                                brojPrisustvaVjezbama = prisustvo.vjezbe;  
                                varijabla = prisustvo.predavanja;    
                                studentuUnesenoPrisustvo = 1;    
                            }      
                        });                                    
                        if(studentuUnesenoPrisustvo == 0) {
                            function clickHandler() {               
                                p.vjezbe = 1;
                                p.predavanja = 0;
                                p.sedmica = trenutnaSedmica;
                                p.index = student.index;
                                podaciUpdate(podaci.predmet, student.index,p);
                            }
                            cell.style.backgroundColor = "white";
                            cell.addEventListener('click', clickHandler);
                        }
                        else {                                     
                            if(j <= brojPrisustvaVjezbama) {
                                function clickHandler() {               
                                    p.vjezbe = brojPrisustvaVjezbama - 1;
                                    p.predavanja = varijabla;
                                    p.sedmica = trenutnaSedmica;
                                    p.index = student.index;
                                    podaciUpdate(podaci.predmet, student.index,p);
                                }
                                cell.style.backgroundColor = "#80d800";
                                cell.addEventListener('click', clickHandler);
                            }
                            else {
                                function clickHandler() {               
                                    p.vjezbe = brojPrisustvaVjezbama + 1;
                                    p.predavanja = varijabla;
                                    p.sedmica = trenutnaSedmica;
                                    p.index = student.index;
                                    podaciUpdate(podaci.predmet, student.index,p);
                                }
                                cell.style.backgroundColor = "red";
                                cell.addEventListener('click', clickHandler);
                            }
                        }
                        let textNode = document.createTextNode("");
                        cell.appendChild(textNode);
                        row2.appendChild(cell);                    
                    }
                     //CLICK NA CELIJU
                    
                    // 
                }
                //popunjavanje procenata
                else if(i <= brojUnesenihSedmica) {
                        let cell = document.createElement('td');
                        cell.rowSpan = 2;
                        var procenat = "";
                        podaci.prisustva.forEach(prisustvo => {
                            if(prisustvo.index == student.index && prisustvo.sedmica == i) {
                                procenat = (prisustvo.predavanja+prisustvo.vjezbe)/(podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno)*100 + "%";
                            }
                        });

                        let textNode = document.createTextNode(procenat);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                }
                //popunjavanje preostalih sedmica
                else {
                    if(brojUnesenihSedmica != 15) {
                        let cell = document.createElement('td');
                        cell.colSpan = 15 - brojUnesenihSedmica;
                        cell.rowSpan = 2;
                        let textNode = document.createTextNode("");
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    }
                }
            }

            table.appendChild(row);
            table.appendChild(row2);
            
        });
        //ubacivanje tabele u div
        divRef.appendChild(table);

        //dugme za prethodnu sedmicu
        var leftButton = document.createElement('button');
        var text = document.createTextNode("prethodna");
        leftButton.appendChild(text);
        leftButton.onclick = function() {
            prethodnaSedmica();
        };
        divRef.appendChild(leftButton);
        //dugme za sljedecu sedmicu
        var rightButton = document.createElement('button');
        var text1 = document.createTextNode("sljedeca");
        rightButton.appendChild(text1);
        rightButton.onclick = function() {
            sljedecaSedmica();
        };
        divRef.appendChild(rightButton);
        return table;
        
        }        
        
    }
    
    IscrtajTabelu(trenutnaSedmica);
      
    let sljedecaSedmica = function () {
        if(trenutnaSedmica != BrojUnesenihSedmica(podaci)) {
            divRef.innerHTML = "";
            trenutnaSedmica = trenutnaSedmica + 1;
            IscrtajTabelu(trenutnaSedmica);
        }
    };

    let prethodnaSedmica = function () {
        if(trenutnaSedmica != 1) {
            divRef.innerHTML = "";
            trenutnaSedmica = trenutnaSedmica - 1;
            IscrtajTabelu(trenutnaSedmica);
        }
    };

    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    };
    
};



