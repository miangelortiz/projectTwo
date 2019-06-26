//Devuelve un token y lo guarda en localStorage al loguearse
function getToken() {
    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;
    fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: usernameValue,
            password: passwordValue
        })
    })
        .then(response => {
            if (response.ok) {
                response.text().then(text => {
                    localStorage.setItem("token", text);
                    location.href = "/";
                });
            }
        });
}



//Muestra user y logOut cuando se registra un usuario (comprueba si hay token)
function showLogIn() {
    const token = localStorage.getItem("token");
    const decode = jwt_decode(token);
    if (token) {
        document.getElementById("navlink2").hidden = true;
        document.getElementById("navlink3").hidden = false;
        const userlog = document.getElementById("userlogin");
        userlog.innerHTML = decode.username;

    }

}

//LogOut, eleimina el token y vuelve a home
function logOut() {
    localStorage.removeItem("token");
    location.href = "/";
}

//muestra información del usuario logueado
function showUser() {
    const token = localStorage.getItem("token");
    const decode = jwt_decode(token);
    if (token) {
        document.getElementById("showInfoCardUser").hidden = false;
        document.getElementById("showAddCardIdea").hidden = true;

        const userlog = document.getElementById("userLog");
        userlog.innerHTML = decode.username;
        const usermail = document.getElementById("userEmail");
        usermail.innerHTML = decode.email;

    }

}

//muestra card para añadir idea
function showIdea() {
    const token = localStorage.getItem("token");
    if (token) {
        document.getElementById("showInfoCardUser").hidden = true;
        document.getElementById("showAddCardIdea").hidden = false;
    }
}

//Añade usuario a la base de datos.Cualquier usuario se puede registrar
function addUser() {
    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;
    const emailValue = document.getElementById("email").value;

    fetch("/api/users/", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            username: usernameValue,
            email: emailValue,
            password: passwordValue
        })
    })
        .then(response => {
            if (response.ok) {
                alert("Usuario reg. correctamente");
                location.href = "/";
            }
        })
}

//Añade idea por el usuario registrado
function addIdea() {
    const titleValue = document.getElementById("title").value;
    const comentaryValue = document.getElementById("comentary").value;

    const token = localStorage.getItem("token");
    

    fetch("/api/users/idea/", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({
            title: titleValue,
            comentary: comentaryValue
        })
    })
        .then(response => {
            if (response.ok) {
                location.href = "/";
            }
        })
}

