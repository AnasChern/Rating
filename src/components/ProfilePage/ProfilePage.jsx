import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router'
import Button from '../Button/Button'
import './ProfilPage.style.scss'
import Error from '../Error/Error'
import { ConfirmDialog } from './ConfirmDialog'
import { Box } from '@mui/material'
import SuccessMesage from '../SuccessMessage/SuccessMessage'


export default function ProfilePage({ setUserRating, setIsLoggedIn }) {

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
  const [isPasswordEdit, setIsPasswordEdit] = useState(false)
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userid")
  const [error, setError] = useState(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

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
        setUser({ ...resData, score: resScoreData.score, password: '' })
        setUserRating(resScoreData.score)
      }

    }
    catch (err) {
      setError("Internal Server Error")
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
      setShowSuccess("Updated successfully")
      getUser();
    } catch (err) { setError("Internal Server Error") }
  }

  async function editPassword() {
    const newPass = { currentPassword, newPassword }
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }, body: JSON.stringify(newPass)
      })
      const res=await response.json();
      console.log(res)
      if(res.Response==="Updated successful"){
        setIsPasswordEdit(false)
        setShowSuccess(res.Response)
        getUser();
      } 
      else{setError(res.Response)}
      
    } catch (err) { setError("Internal Server Error") }
  }


  async function deleteUser() {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      })
      await response.json();
    } catch (err) { setError("Internal Server Error") }
  }

  async function onDeleteUserClick() {
    await deleteUser()
    localStorage.removeItem('token')
    localStorage.removeItem('userid')
    setIsLoggedIn(false)
    setUserRating(null)
    navigate('/login')
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
      setShowSuccess("Updated successfully")
      getUser();
    } catch (error) { setError("Internal Server Error") }
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

  function onEditPasswordClick(e) {
    e.preventDefault()
    if (isPasswordEdit) {
      editPassword()
    } else {
      setIsPasswordEdit(true)
    }
  }

  function onCancelPasswordEdit() {
    setNewPassword('')
    setCurrentPassword('')
    setIsPasswordEdit(false)
  }

const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setError(false);
};
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
    <header className="profile-header">
      <h2>Account Settings</h2>
    </header>
    {!isPasswordEdit &&
      <Box sx={{ pb: 2 }}>
        <Button testid="edit-button-password" onClick={() => setIsPasswordEdit(true)} text='Change password' />
      </Box>
    }
    {isPasswordEdit &&
      <form  className="user-form user-score user-password">
        <div className="form-score" >
          <input className='password-change-input' type="password" id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <span>Current Password</span >
        </div>
        <div className="form-score" >
          <input className='password-change-input' type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <span>New Password</span >
        </div>
        <Button onClick={onEditPasswordClick} disabled={!newPassword || !currentPassword} type='button' text='save' />
        <Button onClick={onCancelPasswordEdit} text='cancel' />
        <Box className="mobile-edit-password-btns">
        <Button isMobile={true} onClick={onEditPasswordClick} disabled={!newPassword || !currentPassword} type='button' text='save' />
        <Button isMobile={true} onClick={onCancelPasswordEdit} text='cancel' />
        </Box>
      </form>}
    <Box>
      <Button onClick={() => setIsConfirmDialogOpen(true)} text='Delete account' />
    </Box>
    <Box className="mobile-settings-btns">
      {!isPasswordEdit && <Button isMobile={true} testid="edit-button-password" onClick={() => setIsPasswordEdit(true)} text='Change password' />}
      <Button isMobile={true} onClick={() => setIsConfirmDialogOpen(true)} text='Delete account' />
    </Box>
    {isConfirmDialogOpen && <ConfirmDialog open={isConfirmDialogOpen} handleClose={() => setIsConfirmDialogOpen(false)} onDelete={onDeleteUserClick} />}
    <Error visible={!!error} text={error} handleClose={handleClose}/>
    <SuccessMesage visible={!!showSuccess} text={showSuccess} handleClose={handleClose}/>
  </div >
    : <Navigate to="/login" />

}
