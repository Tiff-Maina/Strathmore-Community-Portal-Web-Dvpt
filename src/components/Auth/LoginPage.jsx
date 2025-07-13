import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Effect to listen for authentication state changes and redirect if already logged in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // If a user is logged in, attempt to fetch their display name from Firestore.
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              ...currentUser,
              displayName: userData.displayName || currentUser.displayName || currentUser.email
            });
          } else {
            setUser(currentUser);
          }
        } catch (err) {
          console.error("Error fetching user details in LoginPage:", err);
          setUser(currentUser);
        }
        // Redirect to the home page if already logged in.
        navigate('/');
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Clean up the auth listener on component unmount.
  }, [navigate]);

  // Handles the login form submission.
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior.
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully!');
      // The redirection is handled by the useEffect's onAuthStateChanged listener.
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-strathmore-blue to-blue-800 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-strathmore-blue mb-6">
          Login to Strathmore Portal
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
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
              required
              disabled={loading}
            />
          </div>
          <div>
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
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm italic mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-strathmore-blue hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-strathmore-blue focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-strathmore-blue hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;