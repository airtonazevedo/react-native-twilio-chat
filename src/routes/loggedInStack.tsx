import React from 'react'
import { createStackNavigator, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack';
import ContactList from '../loggedInScreens/contactList'
import Chat from '../loggedInScreens/chat'
import Colors from '../constants/colors'
import { useAuth, UserType } from '../contexts/authContext'
import { Text } from 'react-native';
import { Channel } from 'twilio-chat/lib/channel'
import { RouteProp } from '@react-navigation/native';
import { Client } from 'twilio-chat';
import Modal, {ModalProps} from 'react-navigation-modal'

const modalTest = () => {
    return (
        <Modal cancelable={true}>
            <Text>Oioioi</Text>
        </Modal>
    )
}

type RootStackParamList = {
    'Contact List': { user: UserType },
    Chat: { channel: Channel, title: string },
    Modal: {}
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Chat'
>;

export type ChatProps = {
    route: ProfileScreenRouteProp;
    navigation: ProfileScreenNavigationProp;
};

const Stack = createStackNavigator<RootStackParamList>();

const LoggedOutStack: React.FC = () => {

    const options: StackNavigationOptions = {
        headerStyle: {
            backgroundColor: Colors.dark,
            elevation: 0,
            borderWidth: 0,
            shadowColor: Colors.dark
        },
        headerTintColor: Colors.primary,
        headerBackTitle: ' ',
        headerRight: () => <Text onPress={logout} style={{ color: Colors.primary, marginHorizontal: 10 }}>Exit</Text>
    }

    const { logout, user } = useAuth();
    return (
        <Stack.Navigator headerMode="screen" mode="modal" screenOptions={options}>
            <Stack.Screen name="Contact List" component={ContactList} options={({ route }) => ({ title: 'Contact List - ' + user.name })} />
            <Stack.Screen name="Chat" component={Chat} options={({ route }) => ({ title: route.params.title })} />
            <Stack.Screen name="Modal" component={modalTest}  />
       
        </Stack.Navigator>
    )
}

export default LoggedOutStack