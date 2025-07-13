import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // For storing user data in Firestore
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Local user state to manage redirects

  const navigate = useNavigate();

  // Effect to listen for authentication state changes and redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // If a user is logged in, redirect to home page
        navigate('/');
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      // Update Firebase Auth profile with display name
      await updateProfile(currentUser, { displayName: displayName });
      console.log('Firebase Auth profile updated with display name.');

      // Store user details in Firestore 'users' collection
      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName: displayName,
        email: email,
        createdAt: serverTimestamp()
      });
      console.log('User details stored in Firestore.');

      console.log('User registered successfully!');
      // Redirection handled by useEffect's onAuthStateChanged listener
    } catch (err) {
      console.error('Registration error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-strathmore-blue to-blue-800 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-strathmore-blue mb-6">
          Register for Strathmore Portal
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayName">
              Name:
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-strathmore-blue focus:border-transparent transition duration-200"
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>
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
            className="w-full bg-strathmore-gold hover:bg-yellow-600 text-strathmore-blue font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-strathmore-gold focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-strathmore-blue hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
