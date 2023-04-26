import { useState,useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/Authorization/LoginPage';
import RegistrationPage from './components/Authorization/RegistrationPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import Header from './components/Header';



function App() {
  const [isLoggedIn, setIsLoggedIn]= useState(false)
  const [userRating, setUserRating]= useState(null)
  useEffect(() => {
    
    setIsLoggedIn(localStorage.getItem("userid"))
    if(isLoggedIn){
    getUserRating()
    }
  }, [isLoggedIn])
  
  async function getUserRating(){
    
    const userId=localStorage.getItem("userid")
    const token=localStorage.getItem("access_token")
    try{
    const responseScore = await fetch(`http://127.0.0.1:5000/rating/${userId}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });
    
    const resScoreData = await responseScore.json();
    if (responseScore.status === 200) {
      setUserRating(resScoreData.score )
    }
  }
  catch(err){
    console.log(err)
  }
  }


  return (
    <BrowserRouter>
    <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userRating={userRating} setUserRating={setUserRating}/>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/profile" element={<ProfilePage setUserRating={setUserRating}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
