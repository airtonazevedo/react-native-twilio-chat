import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthProps {
    logged: boolean | null,
    login: (user: UserType) => void,
    logout: () => void,
    user: UserType
}

export type UserType = {
    id: string,
    name: string
}

const AuthContext = createContext<AuthProps>({} as AuthProps)

const AuthProvider: React.FC = ({ children }) => {
    const [logged, setLogged] = useState<boolean | null>(null);
    const [user, setUser] = useState<UserType>({} as UserType);

    const load = async () => {
        try {
            const value = await AsyncStorage.getItem('@user')
            if (value !== null) {
                setUser(JSON.parse(value));
                setLogged(true)
            } else {
                setLogged(false)
            }
        } catch (e) {
            setLogged(false);
            // error reading value
        }
    }

    useEffect(() => {
        load()
    }, [])
    const login = async (myUser: UserType) => {
        await AsyncStorage.setItem('@user', JSON.stringify(myUser))
        setUser(myUser)
        setLogged(true);
    }

    const logout = () => {
        AsyncStorage.clear();
        setLogged(false);
        setUser({} as UserType)
    }

    return (
        <AuthContext.Provider value={{ login, logout, user, logged }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)

}

export default AuthProvider

