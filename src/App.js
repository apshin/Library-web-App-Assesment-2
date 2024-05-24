import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './components/BookList/BookList';
import LoginForm from './components/LoginForm/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookDetailContainer from './components/BookDetails/BookDetailContainer';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    // Check if authentication state is stored in localStorage
    const storedLoggedIn = localStorage.getItem('loggedIn');
    if (storedLoggedIn) {
      setLoggedIn(JSON.parse(storedLoggedIn));
    }
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem('loggedIn', true);
    setUsername(username);
    setLoggedIn(true);
    setGuestMode(false);
    alert(`Welcome back, ${username}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    setUsername('');
    setLoggedIn(false);
    setGuestMode(false);
  };

  const handleSignup = (username) => {
    localStorage.setItem('loggedIn', true);
    setUsername(username);
    setLoggedIn(true);
    setGuestMode(false);
    alert(`Welcome, ${username}!`);
  };

  const handleGuestMode = () => {
    console.log("Guest Mode clicked");
    localStorage.removeItem('loggedIn');
    setUsername('');
    setLoggedIn(false);
    setGuestMode(true);
    console.log("guestMode:", guestMode);
  };

  return (
    <Router>
      <div className="App">
      {loggedIn && (
          <div className='user-details'>
            <p>Welcome, {username}</p>
            <button className='button-style' onClick={handleLogout}>Logout</button>
          </div>
      )}
        <Routes>
          <Route
            path="/"
            element={
              loggedIn || guestMode ? (
                <BookList loggedIn={loggedIn} guestMode={guestMode} handleGuestMode={handleGuestMode} setLoggedIn={setLoggedIn} setGuestMode={setGuestMode} />
              ) : (
                <LoginForm onLogin={handleLogin} onSignup={handleSignup} onGuestMode={handleGuestMode} />
              )
            }
          />
          <Route path="/book/:title" element={<BookDetailContainer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
