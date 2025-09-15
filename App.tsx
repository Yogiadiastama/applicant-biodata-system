import React, { useState, useEffect, useCallback } from 'react';
import ApplicantForm from './components/ApplicantForm';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import { ApplicantData } from './types';
import { UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';

type UserRole = 'applicant' | 'admin';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Simple role detection based on email. In a real app, use custom claims.
      if (user) {
        if (user.email?.includes('admin')) {
          setUserRole('admin');
        } else {
          setUserRole('applicant');
        }
      } else {
        setUserRole(null);
      }
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  const handleLogout = useCallback(() => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  }, []);

  const handleFormSubmit = useCallback(async (data: ApplicantData) => {
    try {
      await addDoc(collection(db, 'applicants'), data);
      return 'success';
    } catch (error) {
      console.error("Error adding document: ", error);
      return 'error';
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-mandiri-blue">
            Applicant Biodata System
          </h1>
          {userRole && (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserIcon className="h-5 w-5 text-mandiri-blue"/>
                  <span>Login sebagai: <strong className="font-semibold capitalize">{currentUser?.email}</strong></span>
               </div>
               <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-mandiri-blue transition-colors">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5"/>
                  Logout
               </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        {!currentUser ? (
          <LoginScreen />
        ) : userRole === 'applicant' ? (
          <ApplicantForm onSubmit={handleFormSubmit} />
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
};

export default App;
