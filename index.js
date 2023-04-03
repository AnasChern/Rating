const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const userBtn = document.getElementById('userAccount');
const logoutBtn = document.getElementById('logoutBtn')
const ratingTable = document.getElementById('rating-table')
const isLoggedIn = localStorage.getItem('token');
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const sortInput = document.getElementById('sort')
let users=[];

if (isLoggedIn) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
} else {
    userBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
}
logoutBtn.addEventListener('click', ()=>  {
    localStorage.removeItem('token');
});

getUsers();

async function getUsers() {
    const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const resData = await response.json();
    const responseScore = await fetch(`http://127.0.0.1:5000/ratings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${isLoggedIn}`
        },
    });
    const scores = await responseScore.json();
    resData.forEach(async user => {
        const userScore = scores.find(score => score.student_id === user.id);
        if (userScore) {
            user.score = userScore.score;
            users.push(user);
            const sortedUsers= users.sort((a,b)=>b.score-a.score)
            users= sortedUsers
        }
    });
    users.forEach(user=>addUserRow(user))
}

searchInput.addEventListener("input", () => {
    if (searchInput.value.length >= 3) {
        ratingTable.innerHTML = " "
        const searchUsers = users.filter(user => {
            const lastName = user.lastName.toLowerCase()
            const firstName = user.firstname.toLowerCase()
            const value = searchInput.value.toLowerCase()
            return lastName.includes(value) || firstName.includes(value)
        })
        searchUsers.forEach(user => addUserRow(user))
    } else {
        ratingTable.innerHTML = " "
        users.forEach(user => addUserRow(user))
    }
})

function addUserRow(user) {
    const row = document.createElement("tr");
    const lastName = document.createElement("td");
    const firstName = document.createElement("td");
    const score = document.createElement("td");
    lastName.innerHTML = user.lastName;
    firstName.innerHTML = user.firstname;
    score.innerHTML = user.score;
    lastName.classList.add("cell-left");
    score.classList.add("cell-right");
    row.appendChild(lastName);
    row.appendChild(firstName);
    row.appendChild(score);
    ratingTable.appendChild(row);
}


sortInput.addEventListener("change", ()=>{
    if (sortInput.value==="Score"){
        ratingTable.innerHTML = " "
        const sortedUsers=users.sort((a,b)=>b.score-a.score)
        sortedUsers.forEach(user=>addUserRow(user))
    }
    if (sortInput.value==="Last name"){
        ratingTable.innerHTML = " "
        const sortedUsers=users.sort((a,b)=>{
            if (a.lastName < b.lastName) { 
                return -1; 
              } 
              if (a.lastName > b.lastName) { 
                return 1; 
              } 
              return 0;
        })
        sortedUsers.forEach(user=>addUserRow(user))
    }
})