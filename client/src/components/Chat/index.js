import { useState, useEffect } from "react";
import queryString from "query-string";
import io from 'socket.io-client';
import InfoBar from '../InfoBar/';
import Input from '../Input/';
import Messages from '../Messages/';

import './Chat.css';

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState(0);
    const [room, setRoom] = useState(0);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = "localhost:5000";

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error) => {
            console.log('Chat Error:', error);
        });
        console.log('test');
    }, [ENDPOINT, location.search]);

    useEffect(()=>{
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
    },[messages]);

    const sendMessage = event => {
        event.preventDefault();
        if(messages){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }
    console.log(message, messages);
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar name={name} room={room}/>
                <Messages messages={messages} name={name} />
                <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    )
}

export default Chat;