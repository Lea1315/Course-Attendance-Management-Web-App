function login() {
    var pozivAjax = PoziviAjax
    pozivAjax.postLogin(document.getElementById("username").value, document.getElementById("password").value, fnCallback)
}

function fnCallback(poruka) {
    //redirektati na strane u odnosu na poruku
    if(poruka == "Neuspjesna prijava") {       
        document.getElementById("naslov").textContent = "POGRESAN UNOS, POKUSAJTE PONOVO"
    }
    else {       
        window.location.assign('http://localhost:3000/predmeti.html')
        document.getElementById("naslov").textContent = ""
    }
}