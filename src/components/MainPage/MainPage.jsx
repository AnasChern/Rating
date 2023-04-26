import './MainPage.style.scss'
import React, { useState, useEffect } from 'react'
import RatingRow from './RatingRow';
import { Link } from 'react-router-dom';

export default function MainPage() {
    const [ratingRows, setRatingRows] = useState(null);
    const [allUsers, setAllUsers] = useState(null);

    const [sortValue, setSortValue] = useState('Score');
    const [searchValue, setSearchValue] = useState('');
    const [error, setError] = useState(null);


    const isLoggedIn = localStorage.getItem('token');

    useEffect(() => {
        getUsers();
    }, []);

    const onSortChange = (e) => {
        setSortValue(e.target.value);
        sortUsers(e.target.value);
    }

    const onSearchChange = (e) => {
        setSearchValue(e.target.value);
        const searchUsers = allUsers.filter(user => {
            const lastName = user.lastName.toLowerCase()
            const firstName = user.firstname.toLowerCase()
            const value = e.target.value.toLowerCase()
            return lastName.includes(value) || firstName.includes(value)
        });
        setRatingRows(searchUsers)
    }

    function sortUsers(sortValue) {
        if (sortValue === "Score") {
            const sortedUsers = ratingRows?.sort((a, b) => b.score - a.score)
            setRatingRows(sortedUsers);
        }
        if (sortValue === "Last name") {
            const sortedUsers = ratingRows?.sort((a, b) => {
                if (a.lastName < b.lastName) {
                    return -1;
                }
                if (a.lastName > b.lastName) {
                    return 1;
                }
                return 0;
            })
            setRatingRows(sortedUsers);
        }
    }


    async function getUsers() {
        try {
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
            let users = [];
            resData.forEach(async user => {
                const userScore = scores.find(score => score.student_id === user.id);
                if (userScore) {
                    user.score = userScore.score;
                    users.push(user);
                    const sortedUsers = users.sort((a, b) => b.score - a.score)
                    users = sortedUsers;
                }
            });
            setRatingRows(users);
            setAllUsers(users);
        }
        catch (err) {
            setError(err)

        }
    }

    return (
        <>
            <div className="gradient-box">
                <div className="container">
                    <div>
                        CHECK YOUR RATING <span><Link className="add-my-score" to="/profile">Add my score</Link></span>
                    </div>
                </div>
            </div>

            <section className="rating-page">
                <div className="search-container">
                    <h2>Students rating</h2>
                    <div className="search">
                        <input type="text" placeholder="Search" className="search-input" id="search-input" onChange={onSearchChange} />
                        <button className="search-button" id="search-btn"><svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.5 14.5L19 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></button>
                    </div>
                </div>
                <div className="sort-container">
                    <span>Sort by</span>
                    <select defaultValue="Score" name="sort-value" className="sort-value" id="sort" onChange={onSortChange}>
                        <option>Last name</option>
                        <option>Score</option>
                    </select>
                </div>
                {
                    error && <div>something wrong with network</div>
                }

                <table className="rating-table" cellPadding="10px" >
                    <thead>
                        <tr>
                            <td><b>Last name</b></td>
                            <td><b>First name</b></td>
                            <td><b>Score</b></td>
                        </tr>
                    </thead>
                    <tbody id="rating-table">
                        {ratingRows && ratingRows.map(row => <RatingRow key={row.id} firstName={row.firstname} lastName={row.lastName} score={row.score} />)}
                    </tbody >
                </table>
            </section>
        </>
    )
}
