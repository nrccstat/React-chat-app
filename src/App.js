import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  background-color: #1A202C;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ConversationList = styled.div`
  width: 300px;
  padding: 20px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ConversationItem = styled.div`
  background-color: #2D3748;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: white;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4A5568;
  margin-right: 10px;
`;

const ChatWindow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.header`
  padding: 15px;
  background-color: #2D3748;
  color: white;
  display: flex;
  align-items: center;
`;

const AvatarSmall = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #4A5568;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-size: 1.2em;
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #1A202C;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.sender === 'Me' ? 'flex-end' : 'flex-start')};
  margin: 10px 0;
`;

const MessageBubble = styled.div`
  background-color: ${props => (props.sender === 'Me' ? '#A3BFFA' : '#4A5568')};
  color: white;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessageMeta = styled.div`
  font-size: 0.8em;
  color: #A0AEC0;
  margin: ${props => (props.sender === 'Me' ? '5px 0 0 0' : '5px 0 0 0')};
`;

const InputArea = styled.form`
  display: flex;
  padding: 15px;
  background-color: #2D3748;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
  outline: none;
  background-color: #3A444F;
  color: white;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: #357abd;
  }
`;

const Message = ({ sender, text, timestamp }) => (
  <MessageWrapper sender={sender}>
    <MessageBubble sender={sender}>{text}</MessageBubble>
    <MessageMeta sender={sender}>{timestamp}</MessageMeta>
  </MessageWrapper>
);

const ChatAreaComponent = ({ messages, isTyping }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <ChatArea>
      {messages.map(message => (
        <Message
          key={message.id}
          sender={message.sender}
          text={message.text}
          timestamp={message.timestamp}
        />
      ))}
      {isTyping && (
        <MessageWrapper sender="Alice">
          <MessageBubble sender="Alice">Alice is typing...</MessageBubble>
        </MessageWrapper>
      )}
      <div ref={chatEndRef} />
    </ChatArea>
  );
};

const MessageInput = ({ addMessage, triggerFriendResponse }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addMessage('Me', text, timestamp);
      triggerFriendResponse(text);
      setText('');
    }
  };

  return (
    <InputArea onSubmit={handleSubmit}>
      <Input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Chat with Alice..."
      />
      <SendButton type="submit">Send</SendButton>
    </InputArea>
  );
};

const App = () => {
  const initialMessages = [
    { id: 1, sender: 'Alice', text: 'Hi, I’m Alice! Here to chat and help. How’s your day going?', timestamp: '10:00 AM' }
  ];
  
  const [messages, setMessages] = useState(initialMessages);
  const [conversationState, setConversationState] = useState('greeting');
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (sender, text, timestamp) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text, timestamp }]);
  };

  const getResponse = (userMessage, currentState) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let nextState = currentState;

    if (currentState === 'greeting') {
      if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('fine')) {
        response = 'That’s awesome! What made your day good?';
        nextState = 'asking_about_day';
      } else if (lowerMessage.includes('bad') || lowerMessage.includes('not good')) {
        response = 'Oh no, I’m sorry to hear that. What happened?';
        nextState = 'asking_about_day';
      } else if (lowerMessage.includes('how') && lowerMessage.includes('you')) {
        response = 'I’m doing great, thanks for asking! How about you?';
        nextState = 'general_chat';
      } else {
        response = 'Not sure what you mean. Want to tell me more?';
        nextState = 'general_chat';
      }
    } else if (currentState === 'asking_about_day') {
      response = 'That sounds interesting! What else is on your mind?';
      nextState = 'general_chat';
    } else {
      if (lowerMessage.includes('weather')) {
        response = 'It’s sunny and 75°F here! How’s the weather where you are?';
      } else if (lowerMessage.includes('how are you') || lowerMessage.includes('how you doing')) {
        response = 'I’m doing awesome, thanks! How about you?';
      } else if (lowerMessage.includes('day') || lowerMessage.includes('today')) {
        response = 'My day’s been chill. How’s yours going?';
      } else if (lowerMessage.includes('what') && lowerMessage.includes('doing')) {
        response = 'Just hanging out, chatting with you! What’s up with you?';
      } else if (lowerMessage.includes('joke')) {
        response = 'Here’s one: Why don’t scientists trust atoms? Because they make up everything!';
      } else if (lowerMessage.includes('fact')) {
        response = 'Did you know? A group of flamingos is called a flamboyance!';
      } else if (lowerMessage.includes('music')) {
        response = 'I love music! What kind of tunes are you into?';
      } else if (lowerMessage.includes('movie')) {
        response = 'Movies are great! Seen any good ones lately?';
      } else if (lowerMessage.includes('game')) {
        response = 'Gaming is fun! Do you have a favorite game or genre?';
      } else if (lowerMessage.includes('food')) {
        response = 'I’m a foodie! What’s your favorite dish?';
      } else if (lowerMessage.includes('sports')) {
        response = 'I enjoy sports too! What team or sport do you follow?';
      } else if (lowerMessage.includes('travel')) {
        response = 'Traveling is amazing! Where would you like to go next?';
      } else if (lowerMessage.includes('book')) {
        response = 'Books can be so inspiring. Any good reads lately?';
      } else if (lowerMessage.includes('news')) {
        response = "I try to keep up with the news. Anything in particular you're curious about?";
      } else if (lowerMessage.includes('tech') || lowerMessage.includes('technology')) {
        response = 'Technology is evolving fast! Are you into any gadgets or software?';
      } else if (lowerMessage.includes('art')) {
        response = 'Art is beautiful and expressive. Do you have a favorite artist or style?';
      } else if (lowerMessage.includes('?')) {
        response = 'Good question! I’d say… maybe. What do you think?';
      } else {
        response = 'Cool! Want to tell me more?';
      }
      nextState = 'general_chat';
    }

    return { response, nextState };
  };

  const triggerFriendResponse = (userMessage) => {
    const { response, nextState } = getResponse(userMessage, conversationState);
    setConversationState(nextState);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsTyping(true);
    setTimeout(() => {
      addMessage('Alice', response, timestamp);
      setIsTyping(false);
    }, Math.random() * 1500 + 500);
  };

  return (
    <AppContainer>
      <ChatContainer>
        <ConversationList>
          <ConversationItem>
            <Avatar />
            <div>Alice</div>
          </ConversationItem>
        </ConversationList>
        <ChatWindow>
          <ChatHeader>
            <AvatarSmall />
            <UserName>Alice</UserName>
          </ChatHeader>
          <ChatAreaComponent messages={messages} isTyping={isTyping} />
          <MessageInput addMessage={addMessage} triggerFriendResponse={triggerFriendResponse} />
        </ChatWindow>
      </ChatContainer>
    </AppContainer>
  );
};

export default App;
