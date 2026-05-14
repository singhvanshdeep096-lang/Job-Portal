import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';
import './Messages.css';

const EmployerMessages = () => {
    const [chats, setChats] = useState([
        { id: 'cand1', name: 'John Smith', lastMsg: 'I am interested in the role...', time: '2h ago' },
        { id: 'cand2', name: 'Sarah Wilson', lastMsg: 'Can we schedule an interview?', time: '5h ago' }
    ]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    
    const { user } = useAuth();
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('new_message', (msg) => {
                if (selectedChat && msg.senderId === selectedChat.id) {
                    setMessages(prev => [...prev, msg]);
                }
            });
        }
        return () => socket?.off('new_message');
    }, [socket, selectedChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedChat) return;

        const newMsg = {
            senderId: user._id,
            receiverId: selectedChat.id,
            content: input,
            time: new Date().toLocaleTimeString(),
            isMe: true
        };

        if (socket) socket.emit('send_message', newMsg);
        setMessages([...messages, newMsg]);
        setInput('');
    };

    return (
        <div className="container messages-page">
            <div className="messages-layout card" style={{ height: 'calc(100vh - 180px)' }}>
                <div className="chat-sidebar">
                    <div className="sidebar-header">
                        <h3>Candidate Inbox</h3>
                    </div>
                    <div className="chat-list">
                        {chats.map(chat => (
                            <div 
                                key={chat.id} 
                                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <div className="chat-avatar"><User size={20} /></div>
                                <div className="chat-info">
                                    <div className="chat-name">{chat.name}</div>
                                    <div className="chat-last-msg">{chat.lastMsg}</div>
                                </div>
                                <div className="chat-time">{chat.time}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chat-window">
                    {selectedChat ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-avatar">{selectedChat.name.charAt(0)}</div>
                                <h3>{selectedChat.name}</h3>
                            </div>
                            <div className="messages-display">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`message-bubble ${msg.isMe ? 'me' : 'them'}`}>
                                        <div className="message-content">{msg.content}</div>
                                        <div className="message-time">{msg.time}</div>
                                    </div>
                                ))}
                            </div>
                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                <input 
                                    type="text" 
                                    placeholder="Type a message to candidate..." 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary btn-icon-only">
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <MessageSquare size={64} />
                            <p>Select a candidate from the left to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerMessages;
