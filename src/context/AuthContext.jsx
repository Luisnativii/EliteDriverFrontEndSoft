// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRouteRole } from '../utils/roleMapping';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage (using authService keys)
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Use authService key
        if (token) {
          const userData = JSON.parse(localStorage.getItem('userData')); // Use authService key
          
          if (userData) {
            // Add routeRole using the utility
            const userWithRouteRole = {
              ...userData,
              routeRole: getUserRouteRole(userData),
              isAuthenticated: true
            };
            
            setUser(userWithRouteRole);
          }
        }
      } catch (error) {
        // console.error('Error loading user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // This login function now just processes data already saved by authService
  const login = async (authData) => {
    try {
      // authService already saved the token and user data
      // We just need to update our context state
      if (authData && authData.user) {
        const userWithRouteRole = {
          ...authData.user,
          routeRole: getUserRouteRole(authData.user),
          isAuthenticated: true
        };

        setUser(userWithRouteRole);
        return { success: true, user: userWithRouteRole };
      } else {
        return { success: false, error: 'Invalid auth data' };
      }
    } catch (error) {
      return { success: false, error: 'Error updating context' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const userWithRouteRole = {
      ...updatedUserData,
      routeRole: getUserRouteRole(updatedUserData),
      isAuthenticated: true
    };
    
    localStorage.setItem('userData', JSON.stringify(userWithRouteRole));
    setUser(userWithRouteRole);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context so useAuth can import it
export { AuthContext };