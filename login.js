const loginBtn = document.getElementById('loginBtn');
const userName = document.getElementById('userName');
const password = document.getElementById('password');

loginBtn.addEventListener('click', event => {
    login(userName.value, password.value);
});

async function login(username, password) {
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
        })
    });
    const resData = await response.json();
    if (resData.access_token) {
        localStorage.setItem('token', resData.access_token);
        localStorage.setItem('userid', resData.userid);
        window.location.href = 'index.html';
    } else {
        const errorDiv = document.getElementById('error');
        errorDiv.innerHTML = resData;
    }
}
