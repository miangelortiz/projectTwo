/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Devuelve un token y lo guarda en localStorage al loguearse
function getToken() {
  const usernameValue = document.getElementById('username').value;
  const passwordValue = document.getElementById('password').value;
  fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: usernameValue,
      password: passwordValue,
    }),
  })
    .then((response) => {
      if (response.ok) {
        response.text().then((text) => {
          localStorage.setItem('token', text);
          location.href = '/';
        });
      }
    });
}


// Muestra página principal
function showIntro() {
  const token = localStorage.getItem('token');
  if (!token) {
    document.getElementById('navlink2').hidden = false;
    document.getElementById('showIntro').hidden = false;
  }
}


// Muestra user y logOut cuando se registra un usuario (comprueba si hay token)
function showLogIn() {
  const token = localStorage.getItem('token');
  const decode = jwt_decode(token);
  if (token) {
    document.getElementById('navlink2').hidden = true;
    document.getElementById('navlink3').hidden = false;
    const userlog = document.getElementById('userlogin');
    userlog.innerHTML = decode.username;
  }
}

// LogOut, eleimina el token y vuelve a home
function logOut() {
  localStorage.removeItem('token');
  location.href = '/';
}

// muestra información del usuario logueado
function showUser() {
  const token = localStorage.getItem('token');
  const decode = jwt_decode(token);
  if (token) {
    document.getElementById('showInfoCardUser').hidden = false;
    document.getElementById('showAddCardIdea').hidden = true;
    document.getElementById('showEditIdea').hidden = true;

    const userlog = document.getElementById('userLog');
    userlog.innerHTML = decode.username;
    const usermail = document.getElementById('userEmail');
    usermail.innerHTML = decode.email;
  }
}

// muestra card para añadir idea
function showIdea() {
  const token = localStorage.getItem('token');
  if (token) {
    document.getElementById('showInfoCardUser').hidden = true;
    document.getElementById('showAddCardIdea').hidden = false;
    document.getElementById('showEditIdea').hidden = true;
  }
}

// Añade usuario a la base de datos.Cualquier usuario se puede registrar
function addUser() {
  const usernameValue = document.getElementById('username').value;
  const passwordValue = document.getElementById('password').value;
  const emailValue = document.getElementById('email').value;

  if (usernameValue != '' && emailValue != '' && passwordValue != '') {
    fetch('/api/user/add', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // eslint-disable-next-line no-alert
          alert('Usuario reg. correctamente');
          location.href = '/';
        }
      });
  } else{
    document.getElementById('nullfields').innerHTML = 'You have to fill in all the fields ';
  }
}

// Añade idea por el usuario registrado
function addIdea() {
  const titleValue = document.getElementById('title').value;
  const comentaryValue = document.getElementById('comentary').value;

  const token = localStorage.getItem('token');

  fetch('/api/idea/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: titleValue,
      comentary: comentaryValue,
    }),
  })
    .then((response) => {
      if (response.ok) {
        // eslint-disable-next-line no-restricted-globals
        location.href = '/';
      }
    });
}

// Añadir nota creada por el usuario a home
function createPosit() {
  const token = localStorage.getItem('token');
  if (token) {
    fetch('../api/idea', {
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        document.getElementById('showIntro').hidden = true;
        document.getElementById('showMain').hidden = false;
        response.json().then((json) => {
          const ul = document.getElementById('ul');
          json.map((idea) => {
            const li = document.createElement('li');
            ul.appendChild(li);
            const a = document.createElement('a');
            li.appendChild(a);
            a.href = '#';
            const h2 = document.createElement('h2');
            a.appendChild(h2);
            h2.innerText = idea.title;
            const p = document.createElement('p');
            a.appendChild(p);
            p.innerText = idea.comentary;
          });
        });
      }
    });
  }
}

// Ver ideas de usuario logueado
function showUserIdeas() {
  const token = localStorage.getItem('token');
  if (token) {
    fetch('/api/myidea', {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        document.getElementById('showInfoCardUser').hidden = true;
        document.getElementById('showAddCardIdea').hidden = true;
        document.getElementById('showUserIdeas').hidden = false;

        response.json().then((json) => {
          const ul = document.getElementById('ul');
          ul.innerHTML = '';
          json.map((idea) => {
            const li = document.createElement('li');
            ul.appendChild(li);
            const a = document.createElement('a');
            li.appendChild(a);
            att = document.createAttribute('onclick');
            att.value = `editIdea('${idea.id}')`;
            a.setAttributeNode(att);
            a.href = '#';

            const h2 = document.createElement('h2');
            a.appendChild(h2);
            h2.innerText = idea.title;
            const p = document.createElement('p');
            a.appendChild(p);
            p.innerText = idea.comentary;
          });
        });
      }
    });
  }
}

// Edita la idea seleccionada por el usuario que la crea
function editIdea(id) {
  const token = localStorage.getItem('token');

  if (token) {
    document.getElementById('showEditIdea').hidden = false;
    document.getElementById('showInfoCardUser').hidden = true;
    document.getElementById('showAddCardIdea').hidden = true;

    fetch(`/api/myidea/${id}`, {
      headers: {
        'Content-type': 'application/json',
        // Authorization: "Bearer " + token
      },
    })
      .then(response => response.json())
      .then((ideas) => {
        const sdate = ideas[0].date;
        const ndate = sdate.split('T');
        const ntime = ndate[1].split('.');

        document.getElementById('edittitle').value = ideas[0].title;
        document.getElementById('editcomentary').value = ideas[0].comentary;
        document.getElementById('editdate').innerText = `Day:${ndate[0]}  ` + `at ${ntime[0]}`;
        document.getElementById('updateIdea').setAttribute('onclick', `updateIdea('${ideas[0].id}')`);
        document.getElementById('deleteIdea').setAttribute('onclick', `deleteIdea('${ideas[0].id}')`);
      });
  }
}


// actualiza la idea editada por el usuario
function updateIdea(id) {
  const token = localStorage.getItem('token');
  const titleValue = document.getElementById('edittitle').value;
  const comentaryValue = document.getElementById('editcomentary').value;

  fetch(`/api/myidea/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: titleValue,
      comentary: comentaryValue,
    }),
  })
    .then((response) => {
      if (response.ok) {
        location.href = '/';
      }
    });
}

// Borra una idea creada por un usuario
function deleteIdea(id) {
  const token = localStorage.getItem('token');
  if (token) {
    fetch(`/api/myidea/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    location.href = '/';
  }
}
