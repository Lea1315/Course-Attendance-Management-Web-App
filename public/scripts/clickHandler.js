function podaciUpdate(naziv, index, prisustvo) {
    var pozivAjax = PoziviAjax
    pozivAjax.postPrisustvo(naziv, index, prisustvo, funkcijaCallback)
    console.log(naziv, index, prisustvo.vjezbe, prisustvo.predavanja, prisustvo.sedmica)
}

function funkcijaCallback(podaci) {
    console.log(podaci)
    var divRef = document.getElementById("tabela")
    let tabela = TabelaPrisustvo(divRef, podaci.prisustva)
    
}

