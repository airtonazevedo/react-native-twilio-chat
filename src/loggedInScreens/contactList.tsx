import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native'
import Colors from '../constants/colors'
import { FlatList } from 'react-native-gesture-handler'
import { UserType, useAuth } from '../contexts/authContext'
import { useNavigation } from '@react-navigation/native';
import Chat, { Client } from 'twilio-chat';
import api from '../services/api'
import AsyncStorage from '@react-native-community/async-storage'
import prompt from 'react-native-prompt-android';
import { Channel } from 'twilio-chat/lib/channel'

//import { syncServiceDetails } from '../services/chat'
type ContactsType = {
    channel: Channel
}

interface itemProps {
    item: ContactsType
}

const Item = ({ item }: itemProps) => {
    const { user } = useAuth()
    const [lastMessage, setLastMessage] = useState('')
    const [countNewMessages, setCountNewMessages] = useState(0)

    const load = async () => {
        try {
        setLastMessage((await item.channel.getMessages(1)).items[0].body);
        } catch {
            setLastMessage('');
        }
        setCountNewMessages(await item.channel.getUnconsumedMessagesCount());


    }
    useEffect(() => {
        load()
    }, [])

    let names = item.channel.uniqueName.split('_chat_')
    let contactName = names[0]
    if (user.name == names[0])
        contactName = names[1]

    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ paddingHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', height: 60 }}
            onPress={() => navigation.navigate('Chat', { channel: item.channel, title: contactName })}
        >
            <Text style={{ color: Colors.primary, fontSize: 18 }}>{contactName}</Text>
            <Text numberOfLines={1} style={{ maxWidth: '50%', color: Colors.primary, fontSize: 12 }}>{lastMessage}</Text>

            <View style={{ maxWidth: '20%' }}>
                <Text numberOfLines={1} style={{ color: Colors.primary, fontSize: 14 }}>{item.channel.lastMessage?.timestamp?.toString()}</Text>
                <Text style={{ color: Colors.primary, fontSize: 14 }}>{countNewMessages}</Text>

            </View>
        </TouchableOpacity>
    )
}

const contactList: React.FC = () => {

    const { user, login } = useAuth()
    const [contacts, setContacts] = useState<ContactsType[]>([])
    const [myClient, setClient] = useState<Chat>({} as Chat)
    const load = async () => {
        api.post('token', { id: user.name }).then(res => {
            const newToken = { id: res.data.token, name: res.data.identity }
            login(newToken)
            Chat.create(res.data.token)
                .then(async client => {
                    
                    setClient(client);
                    (await client.getUserChannelDescriptors()).items.map(async item => {
                        const channel = await item.getChannel()
                        console.log(channel.friendlyName)
                        if (item.status == 'invited')
                            setupChannel(channel);
                    })
                    //client.user.updateAttributes({avatar: 'ronaldinho'})
                    //client.user.updateFriendlyName(user.name + " Amigo")
                    //console.log((await client.getUser('Migo')).friendlyName)
                    //console.log((await client.getUserChannelDescriptors()).items[0].status)
                    const subscribedChannels = await client.getSubscribedChannels();
                    let arrContacts: ContactsType[] = [] as ContactsType[]
                    subscribedChannels.items.forEach(async channel => {
                        
                        const loadContacts: ContactsType = {
                            channel
                        }
                        arrContacts.push(loadContacts)
                        setContacts([...arrContacts])
                        //channel.lastMessage
                    });
                    //setContacts([...arrContacts])
                }).catch(err => {
                    console.log('err 1 \n\n\n');
                    console.log(err)
                })
        })
    }

    useEffect(() => {

        load(); /*
        AsyncStorage.getItem('@contacts')

            .then(contactsJson => {
                if (contactsJson) {
                    let contactsArr = JSON.parse(contactsJson);
                    setContacts(contactsArr)

                }
            })*/

    }, [])

    //useEffect(() => { console.log(contacts) }, [contacts])

    const addUser = () => {
        const okPress = async (txt: string) => {
            if (user.name == txt)
                return Alert.alert('This is your username')
            const checkIfExist = contacts.filter(({ channel }) => {
                let names = channel.uniqueName.split('_chat_')
                /*channel.join().then(res => {
                    console.log('entrou')
                }).catch(err => console.log(err))
                */
                console.log(channel.uniqueName);
                return txt == names[0] || txt == names[1]
            })
            
            if (checkIfExist.length > 0)
                return Alert.alert('User already added')

            try {
                await myClient.getUser(txt)
            let uniqueChatName = `${txt}_chat_${user.name}`
            if (user.name < txt)
                uniqueChatName = `${user.name}_chat_${txt}`

            myClient.getChannelByUniqueName(uniqueChatName)
                .then(channel => {
                    setupChannel(channel);
                }).catch(() => {
                    myClient.createChannel({
                        uniqueName: uniqueChatName,
                        friendlyName: uniqueChatName,
                        isPrivate: true
                    }).then(function (channel) {
                        console.log('Created general channel:');
                        console.log(channel.uniqueName);
                        channel.invite(txt)
                            .then(res => console.log(txt + ' convidado!'))
                            .catch(err => console.log(err))
                        setupChannel(channel);
                    }).catch(function (channel) {
                        console.log('Channel could not be created:');
                        console.log(channel);
                    });
                })
            } catch {
                Alert.alert('User not found!')
            }
        }

        if (Platform.OS == 'ios')
            Alert.prompt('Add Contact', 'Enter the username', okPress)
        else
            prompt('Add Contact', 'Enter the username',
                [
                    { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                    { text: 'OK', onPress: okPress },
                ],
                {
                    type: 'default',
                    cancelable: true,
                    defaultValue: '',
                    placeholder: ''
                }
            )
    }

    const setupChannel = (channel: Channel) => {
        channel.join()
            .then(function () {
                console.log('setpuo channel sucess join')
                //getHistoryMessages()
                const loadContacts: ContactsType = {
                    channel
                }
                let arrContacts = [...contacts, loadContacts]
                setContacts([...arrContacts])
            }).catch(error => {
                console.log('error to join')
                console.log(error)
                //getHistoryMessages()
            });
    }
    return (
        <>

            <View style={styles.container}>
                <TouchableOpacity style={styles.fab} onPress={addUser}>
                    <Text style={{ color: Colors.primary, fontSize: 42 }}>+</Text>
                </TouchableOpacity>

                <FlatList<ContactsType>
                    data={contacts}
                    renderItem={(props) => <Item item={props.item} />}
                    keyExtractor={(item, index) => 'key' + index}
                    ItemSeparatorComponent={() => <View style={{ borderTopColor: Colors.gray, width: '100%', borderWidth: StyleSheet.hairlineWidth }} />}
                />
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor: Colors.secondary,
        borderRadius: 30,
        elevation: 5,
        zIndex: 5
    },
    container: {
        flex: 1,
        //paddingHorizontal: 20,
        backgroundColor: Colors.background
    },
    label: {
        marginTop: '50%',
        color: Colors.primary,
        margin: 5,
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.dark,
        color: Colors.primary

    },
    btn: {
        marginTop: 20,
        marginHorizontal: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark,
        height: 40,
        borderRadius: 10

    },
    btnLabel: {
        color: Colors.primary,
        fontWeight: 'bold',

    }
})
export default contactList