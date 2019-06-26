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

function showLogIn() {
    const token = localStorage.getItem("token");
    const decode = jwt_decode(token);
    if (token) {
        document.getElementById ("navlink2").hidden = true;
        document.getElementById ("navlink3").hidden = false;
        const userlog = document.getElementById("userlogin");
        userlog.innerHTML = decode.username;
       
    }

}

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
            email:emailValue,
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

function logOut() {

    localStorage.removeItem("token");
    location.href = "/";


}