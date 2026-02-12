import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (username, password) => {
        setIsLoading(true);
        // TODO: Connect to backend
        // try {
        //   const response = await api.post('/auth/login', { username, password });
        //   const { token, user } = response.data;
        //   setUserToken(token);
        //   setUserInfo(user);
        //   await AsyncStorage.setItem('userToken', token);
        //   await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        // } catch (e) {
        //   console.log('Login error', e);
        //   throw e; // Rethrow to handle in UI
        // } finally {
        //   setIsLoading(false);
        // }

        // Placeholder Logic for Demo
        setTimeout(async () => {
            const dummyToken = 'dummy-jwt-token';
            const dummyUser = { name: 'Parent User', email: 'parent@example.com' };
            setUserToken(dummyToken);
            setUserInfo(dummyUser);
            await AsyncStorage.setItem('userToken', dummyToken);
            await AsyncStorage.setItem('userInfo', JSON.stringify(dummyUser));
            setIsLoading(false);
        }, 1000);
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');

            if (userToken) {
                setUserToken(userToken);
                setUserInfo(JSON.parse(userInfo));
            }
            setIsLoading(false);
        } catch (e) {
            console.log('isLogged in error', e);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
