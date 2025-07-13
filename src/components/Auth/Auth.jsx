import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect listens for changes in the user's authentication state (login/logout).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Updates the 'user' state with the current user or null.
      setLoading(false); // Indicates that the initial authentication check is complete.
    });

    return () => unsubscribe(); // Cleans up the listener when the component unmounts.
  }, []);

  // Handles user registration with email and password.
  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully!');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Registration error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handles user login with email and password.
  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully!');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handles user logout.
  const handleLogout = async () => {
    setError('');
    setLoading(true);
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
    } catch (err) {
      console.error('Logout error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Displays a loading message while checking the authentication state.
  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-strathmore-lightBlue">
        <p className="text-lg text-strathmore-blue">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-strathmore-blue to-blue-800 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-strathmore-blue mb-6">
          {user ? 'Welcome to Strathmore Portal!' : 'Join Strathmore Community'}
        </h2>

        {user ? (
          // Renders if a user is logged in.
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-4">
              Logged in as: <span className="font-semibold text-strathmore-blue">{user.email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6 break-words">
              User ID: <span className="font-mono text-xs">{user.uid}</span>
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging Out...' : 'Logout'}
            </button>
          </div>
        ) : (
          // Renders the login/registration form if no user is logged in.
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue focus:border-transparent transition duration-200"
                placeholder="strathmore.student@strathmore.edu"
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue focus:border-transparent transition duration-200"
                placeholder="********"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm italic mb-4 text-center">{error}</p>
            )}

            <div className="flex flex-col space-y-4">
              <button
                onClick={handleLogin}
                className="bg-strathmore-blue hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-strathmore-blue focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login'}
              </button>
              <button
                onClick={handleRegister}
                className="bg-strathmore-gold hover:bg-yellow-600 text-strathmore-blue font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-strathmore-gold focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;