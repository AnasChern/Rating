const registerBtn = document.getElementById('registerBtn');
const userName = document.getElementById('userName');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const role = document.getElementById('role');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');

registerBtn.addEventListener('click', event => {
    register();
});

async function register() {
    const response = await fetch('http://127.0.0.1:5000/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: userName.value,
            firstname: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            phone: phone.value,
            role: "student"
        })
    });
    const resData = await response.json();
    if (response.status === 200) {
        window.location.href = 'login.html';
    } else {
        const errorDiv = document.getElementById('error');
        errorDiv.innerHTML = resData.Response;
    }
}
