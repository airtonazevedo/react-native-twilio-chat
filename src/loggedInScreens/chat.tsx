import React, { useEffect, useState } from 'react';
import {
    View,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Text,
    SafeAreaView,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import Colors from '../constants/colors'
import { ChatProps } from '../routes/loggedInStack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ChatTwilio, { Client } from 'twilio-chat'
import { Channel } from 'twilio-chat/lib/channel'
import { useAuth } from '../contexts/authContext';
import { SendPush } from '../services/push'

type Message = {
    author: string,
    body: string
}

const Chat = ({ route }: ChatProps) => {
    const ref = React.useRef(null);
    useScrollToTop(ref);
    const { channel } = route.params
    const { user } = useAuth()
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessagens] = useState<Message[]>([])
    const [renderMessage, setRenderMessage] = useState<Message>({} as Message)

    let [getChannel, setChannel] = useState<Channel>({} as Channel);

    const load = async () => {
        try {
            /*
            let uniqueChatName = `${contact.name}_chat_${user.name}`
            if (user.name < contact.name)
                uniqueChatName = `${user.name}_chat_${contact.name}`
            
            console.log('get Channel by name')
            return client.getChannelByUniqueName(uniqueChatName)
                .then(channel => {
                    setChannel(() => channel)
                    setupChannel(channel);

                    console.log(channel.uniqueName)
                    return channel
                }).catch(() => {

                    //console.log('chegou aqui')
                    // Chat not found
                    return client.createChannel({
                        uniqueName: uniqueChatName,
                        friendlyName: uniqueChatName
                    }).then(function (channel) {
                        console.log('Created general channel:');
                        console.log(channel.uniqueName);
                        setChannel(() => channel)
                        setupChannel(channel);
                        return channel
                    }).catch(function (channel) {
                        console.log('Channel could not be created:');
                        console.log(channel);
                    });
                })
            // chat found
                */

        } catch {
            console.log('client error')
        }
    }

    const setupChannel = () => {
        setChannel(() => channel)
        channel.join()
            .then(function () {
                getHistoryMessages()
            }).catch(error => {
                console.log('error to join')
                console.log(error)
                getHistoryMessages()
            });
    }

    const eventOn = (message: Message) => {
        const newMsg = ({ author: message.author, body: message.body })
        if (newMsg.author != user.name) {
            //SendPush(newMsg);
        }
        setRenderMessage(newMsg)

    }

    const getHistoryMessages = () => {
        channel.getMessages(30).then(msgs => {
            console.log('last messages')
            const lastMsgs = msgs.items.map(item => { return { author: item.author, body: item.body } })
            //console.log(msgs.items[0].author)
            //console.log(lastMsgs)
            setMessagens(lastMsgs)

        }).catch(error => {
            console.log('error to load messages')
            console.log(error)
        })


        channel.on('messageAdded', eventOn);
    }



    useEffect(() => {
        /*var channel: Channel = {} as Channel;
        
        load().then(res => {
            channel = res as Channel
        });
        */
       setupChannel();

        return (() => {
            console.log(channel.off)
            if (channel) {
                channel.off('messageAdded', eventOn)
            }

        })
    }, [])

    useEffect(() => {
        if (renderMessage)
            setMessagens([...messages, renderMessage])

    }, [renderMessage])

    const sendMessage = async () => {
        let chatChannel = getChannel;

        chatChannel.sendMessage(newMessage)
            .then(res => {
                setNewMessage('')
            }).catch(error => {
                console.log('error to send message')
                console.log(error);
            })
    }
    let renderMsgs = [...messages];
    renderMsgs.reverse();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <SafeAreaView style={{ flex: 1 }}>

                <KeyboardAvoidingView style={styles.container}
                    behavior={Platform.OS == 'ios' ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS == 'ios' ? 100 : 80}
                >

                    <ScrollView style={[styles.inverted, styles.scroll]}>
                        {renderMsgs.map((msg, i) => {

                            return (
                                <View
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={i}
                                    style={[styles.inverted, msg.author == user.name ? styles.odd : styles.even]}
                                >
                                    <View
                                        style={[
                                            styles.bubble,
                                            msg.author == user.name ? {
                                                backgroundColor: Colors.secondary,
                                                marginLeft: ('20%'),
                                                marginRight: 6,
                                            } :
                                                {
                                                    backgroundColor: Colors.dark,
                                                    marginLeft: 6,
                                                    marginRight: ('20%'),
                                                }
                                        ]}
                                    >
                                        <Text style={{ textAlign: 'left', color: Colors.primary }}>{msg.body}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                    <View style={styles.contentInput}>
                        <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                            { /*
                        <Icon name='attach-file' size={24} style={{ marginRight: 5 }} color={Colors.secondary} />
                        <Icon name='add-a-photo' size={24} color={Colors.secondary} />
                        */}
                            <TouchableOpacity onPress={sendMessage} style={styles.send}>
                                <Text style={{ fontWeight: 'bold', color: Colors.light }}>
                                    SEND
                                </Text>
                            </TouchableOpacity>
                        </View >
                        <View style={{ flexGrow: 1 }}>
                            <TextInput
                                style={styles.inputStyle}
                                placeholder='Digite aqui...'
                                placeholderTextColor={Colors.gray}
                                onChangeText={(txt) => setNewMessage(txt)}
                                onSubmitEditing={() => { sendMessage(); return true }}
                                blurOnSubmit={false}
                                value={newMessage}
                            />
                        </View>
                    </View >

                </KeyboardAvoidingView >
            </SafeAreaView >
        </View >

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentInput: {
        paddingHorizontal: 10,
        height: 68,
        borderTopColor: Colors.gray,
        borderTopWidth: StyleSheet.hairlineWidth,
        backgroundColor: Colors.background,
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    scroll: {
        backgroundColor: Colors.background,
        paddingHorizontal: 5,

    },
    inverted: {
        transform: [{ scaleY: -1 }],
    },
    content: {
        padding: 16,
    },
    even: {
        flexDirection: 'row',
    },
    odd: {
        flexDirection: 'row-reverse',
    },
    avatar: {
        marginVertical: 8,
        marginHorizontal: 6,
        height: 40,
        width: 40,
        borderRadius: 20,
        borderColor: 'rgba(0, 0, 0, .16)',
        borderWidth: StyleSheet.hairlineWidth,
    },
    bubble: {
        marginVertical: 8,
        marginHorizontal: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    inputStyle: {
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        width: '100%',
        backgroundColor: Colors.dark,
        borderColor: Colors.dark,
        paddingHorizontal: 20,
        color: Colors.primary
    },
    send: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 40,
        borderRadius: 10,
        borderColor: Colors.light,
        borderWidth: 2
    }
});

export default Chat