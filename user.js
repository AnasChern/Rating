const token = localStorage.getItem("token")
const userId = localStorage.getItem("userid")
const editBtn = document.getElementById('editBtn');
const userName = document.getElementById('userName');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const role = document.getElementById('role');

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const userBtn = document.getElementById('userAccount');
const logoutBtn = document.getElementById('logoutBtn')
const editScore = document.getElementById('edit-score')
const inputScore = document.getElementById('input-score')
const editPersonalData = document.getElementById('edit-personal-data')
const isLoggedIn = localStorage.getItem('token');
getUserInfo();

let password = " ";

if (isLoggedIn) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
} else {
    userBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
});

async function getUserInfo() {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://127.0.0.1:5000/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    const responseScore = await fetch(`http://127.0.0.1:5000/rating/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    const resData = await response.json();
    const resScoreData = await responseScore.json();
    password = resData.password;
    if (response.status === 200) {
        userName.value = resData.username;
        firstName.value = resData.firstname;
        lastName.value = resData.lastName;
        email.value = resData.email;
        phone.value = resData.phone;

    }
    if (responseScore.status === 200) {
        inputScore.value = resScoreData.score
    }
}

editScore.addEventListener("click", () => {
    if (editScore.innerText === "save") {
        createScore();
        inputScore.setAttribute("disabled", " ")
        editScore.innerHTML = "edit";
    } else {
        inputScore.removeAttribute("disabled");
        inputScore.focus();
        editScore.innerHTML = "save";
    }
});

editPersonalData.addEventListener("click", () => {
    if (editPersonalData.innerText === "save") {
        editUserInfo();
        firstName.setAttribute("disabled", " ")
        lastName.setAttribute("disabled", " ")
        userName.setAttribute("disabled", " ")
        email.setAttribute("disabled", " ")
        phone.setAttribute("disabled", " ")
        editPersonalData.innerHTML = "edit";
    } else {
        firstName.removeAttribute("disabled");
        lastName.removeAttribute("disabled");
        userName.removeAttribute("disabled");
        email.removeAttribute("disabled");
        phone.removeAttribute("disabled");
        firstName.focus();
        editPersonalData.innerHTML = "save";
    }
});

async function editUserInfo() {
    const response = await fetch(`http://127.0.0.1:5000/user/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }, body: JSON.stringify({
            username: userName.value,
            firstname: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phone: phone.value,
            role: "student",
        })
    })
    await response.json();

}
async function createScore() {
    const response = await fetch(`http://127.0.0.1:5000/rating`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }, body: JSON.stringify({
            score: + inputScore.value,
            student_id: userId
        })
    })
    await response.json();
}