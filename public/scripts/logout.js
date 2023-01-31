function logout() {
    var pozivAjax = PoziviAjax
    pozivAjax.postLogout(fnCallback)
    console.log("logout")
}

function fnCallback() {
    //redirektati na prijavu
    window.location.assign('http://localhost:3000/prijava.html')
}

