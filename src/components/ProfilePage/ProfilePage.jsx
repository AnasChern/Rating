import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import Button from '../Button/Button'
import './ProfilPage.style.scss'
import Error from '../Error/Error'

export default function ProfilePage({ setUserRating }) {
  const [user, setUser] = useState({
    firstname: " ",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    score: ""
  })
  const [isUserEdit, setIsUserEdit] = useState(false)
  const [isScoreEdit, setIsScoreEdit] = useState(false)
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userid")
  const [error, setError] = useState(null)

  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [])

  async function getUser() {
    try {

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


      if (response.status === 200) {
        setUser(resData)
      }
      if (responseScore.status === 200) {
        setUser({ ...resData, score: resScoreData.score })
        setUserRating(resScoreData.score)
      }

    }
    catch (err) {
      setError(err)
    }
  }

  async function editUser() {
    const newUser = { ...user, role: "student" }
    delete newUser.score;
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }, body: JSON.stringify(newUser)
      })
      await response.json();
      setIsUserEdit(false)
      getUser();
    } catch (err) { setError(err) }
  }

  async function editScore() {
    try {
      const response = await fetch(`http://127.0.0.1:5000/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }, body: JSON.stringify({
          score: + user.score,
          student_id: userId
        })
      })
      await response.json();
      setIsScoreEdit(false)
      getUser();
    } catch (error) { console.error(error) }
  }

  function handleInputChange(e, field) {
    setUser({ ...user, [field]: e.target.value })
  }

  function onEditUserClick() {
    if (isUserEdit) {
      editUser()
    } else {
      setIsUserEdit(true)
    }
  }

  function onEditScoreClick() {
    if (isScoreEdit) {
      editScore()
    } else {
      setIsScoreEdit(true)
    }
  }

  return userId ? <div className="profile-page-wrapper" >
    < header className="profile-header" >
      <h2>Your Personal Information</h2>
      <Button testid="edit-button-user" onClick={onEditUserClick} text={isUserEdit ? "save" : "edit"} />
    </header >
    <form className="user-form">
      <div className="form-row">
        <input type="text" disabled={!isUserEdit} id="firstName" value={user?.firstname} onChange={(e) => handleInputChange(e, "firstname")} />
        <span>First name</span>
      </div>
      <div className="form-row">
        <input type="text" disabled={!isUserEdit} id="lastName" value={user?.lastName} onChange={(e) => handleInputChange(e, "lastName")} />
        <span>Last name</span>
      </div>
      <div className="form-row">
        <input type="text" disabled={!isUserEdit} id="userName" value={user?.username} onChange={(e) => handleInputChange(e, "username")} />
        <span>Username</span>
      </div>
      <div className="form-row">
        <input type="email" disabled={!isUserEdit} id="email" value={user?.email} onChange={(e) => handleInputChange(e, "email")} />
        <span>Email</span>
      </div>
      <div className="form-row">
        <input type="tel" disabled={!isUserEdit} pattern="^[0-9]*$" id="phone" value={user?.phone} onChange={(e) => handleInputChange(e, "phone")} />
        <span>Phone</span>
      </div>
      <div className="form-row">
        <input type="text" disabled value="STUDENT" id="role" />
        <span>Role</span>
      </div>
      <Button isMobile={true} onClick={onEditUserClick} text={isUserEdit ? "save" : "edit"} />
    </form>
    <header className="profile-header">
      <h2>Your Score</h2>
      <Button testid="edit-button-score" onClick={onEditScoreClick} text={isScoreEdit ? "save" : "edit"} />
    </header>
    <form className="user-form user-score">
      <div className="form-score" >
        <input type="text" disabled={!isScoreEdit} id="input-score" value={user?.score} onChange={(e) => handleInputChange(e, "score")} />
        <span>Score</span >
      </div>
      <Button isMobile={true} onClick={onEditScoreClick} text={isScoreEdit ? "save" : "edit"} />
    </form>
    <Error visible={error} text='something wrong with network' />
  </div >
    : <Navigate to="/login" />

}
