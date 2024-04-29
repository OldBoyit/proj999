// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // This useEffect might still be useful if you store the auth token in localStorage
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            setUser(currentUser);
        }
    }, []);

    const login = async (username, password) => {
        try {
            // Replace '/api/login' with your actual backend login route
            const response = await axios.post('http://localhost:3001/api/login', {
                username,
                password
            });
            if (response.data.token) {
                const user = {
                    ...response.data,
                    username  // Store additional user info if necessary
                };
                localStorage.setItem('currentUser', JSON.stringify(user));  
                setUser(user);
            } else {
                alert('Login failed: Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error.response.data.message);
            alert('Login failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const registerProducer = async (username, password) => {
        try {
            // Replace '/api/producers/register' with your actual backend register route
            const response = await axios.post('http://localhost:3001/api/producers/register', {
                username,
                password
            });
            if (response.data) {
                alert('Producer registered successfully');
                login(username, password);  // Optionally auto-login after registration
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('Username already exists');
            } else {
                alert('Registration failed');
            }
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, registerProducer }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);




