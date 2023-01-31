const PoziviAjax = (()=>{

    //fnCallback u svim metodama se poziva kada stigne odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data, error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška poruka se prosljeđuje u error parametar callback-a, a data je tada null
    function impl_getPredmet(naziv,funCallback){
      var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){          
           funCallback(JSON.parse(ajax.responseText))
        }
        else if (ajax.readyState == 4)
           funCallback(null);
        }
        ajax.open("GET","/predmet/"+naziv, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({naziv: naziv}));
    }
    // vraća listu predmeta za loginovanog nastavnika ili grešku da nastavnik nije loginovan
    function impl_getPredmeti(fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
           var jsonRez = JSON.parse(ajax.responseText);
           fnCallback(jsonRez.poruka);
        }
        else if (ajax.readyState == 4)
           fnCallback(null);
        }
        ajax.open("GET","/predmeti",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(null);
    }
    function impl_postLogin(username,password,fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
           var jsonRez = JSON.parse(ajax.responseText);
           fnCallback(jsonRez.poruka);
        }
        else if (ajax.readyState == 4)
           fnCallback(null);
        }
        ajax.open("POST","/login",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({username: username, password: password}));
    }
    function impl_postLogout(fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
           fnCallback();
        }
        else if (ajax.readyState == 4)
           fnCallback(null);
        }
        ajax.open("POST","/logout",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(null);
    }
    //prisustvo ima oblik {sedmica:N,predavanja:P,vjezbe:V}
    function impl_postPrisustvo(naziv,index,prisustvo,funkcijaCallback){
      var ajax = new XMLHttpRequest();
      ajax.onreadystatechange = function() {
      if (ajax.readyState == 4 && ajax.status == 200){
         var jsonRez = JSON.parse(ajax.responseText);
         funkcijaCallback(jsonRez);
      }
      else if (ajax.readyState == 4)
         console.log("problem")
      }
      ajax.open("POST","/prisustvo/predmet/"+naziv+"/student/"+index,true);
      ajax.setRequestHeader("Content-Type", "application/json");
      ajax.send(JSON.stringify({sedmica: prisustvo.sedmica, predavanja: prisustvo.predavanja, vjezbe: prisustvo.vjezbe}));
    }

    return{
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getPredmet: impl_getPredmet,
        getPredmeti: impl_getPredmeti,
        postPrisustvo: impl_postPrisustvo
    };
})();
