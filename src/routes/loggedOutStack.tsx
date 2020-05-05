import React from 'react'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Login from '../loggedOutScreens/login'
import Colors from '../constants/colors'
const Stack = createStackNavigator();

const options: StackNavigationOptions = {
    headerStyle: {
        backgroundColor: Colors.dark,
        elevation: 0,
        borderWidth: 0,
        shadowColor: Colors.dark
    },
    headerTintColor: Colors.primary
}

const LoggedOutStack: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={options}>
            <Stack.Screen name="Login" component={Login}  />
        </Stack.Navigator>
    )
}

export default LoggedOutStack