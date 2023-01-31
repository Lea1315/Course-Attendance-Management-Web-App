function openPredmet(p) {
    var naziv = p.innerHTML
    var pozivAjax = PoziviAjax
    pozivAjax.getPredmet(naziv, funCallback)
}
function funCallback(podaci) {
    var divRef = document.getElementById("tabela")
    console.log(podaci)
    let tabela = TabelaPrisustvo(divRef, podaci.prisustva)
    
}