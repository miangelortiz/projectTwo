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
    //const decode = jwt_decode(token);
    if (token) {
        document.getElementById ("navlink2").hidden = true;
        document.getElementById ("navlink3").hidden = false;
    }

}