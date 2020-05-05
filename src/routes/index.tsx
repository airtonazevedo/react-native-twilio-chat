import React from 'react'
import { View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import Login from './loggedOutStack'
import ContactList from './loggedInStack'

const routes: React.FC = () => {

    const { logged } = useAuth()

    if (logged == null) 
        return <></>

    if (logged)
        return <ContactList/>
    else 
        return <Login/>

}

export default routes