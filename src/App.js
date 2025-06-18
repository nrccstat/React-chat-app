import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import nlp from 'compromise';
import nlpNumbers from 'compromise-numbers';
import nlpDates from 'compromise-dates';
nlp.extend(nlpNumbers);
nlp.extend(nlpDates);

const trainingData = [
  { keywords: ['happy', 'joy', 'excited', 'great'], response: "I'm glad you're feeling positive! What's making you feel this way?" },
  { keywords: ['sad', 'upset', 'angry', 'frustrated'], response: "I'm sorry you're feeling down. Would you like to talk about what's bothering you?" },
  { keywords: ['work', 'job', 'career', 'business'], response: "Work can be challenging. How's your professional life going?" },
  { keywords: ['family', 'parents', 'siblings', 'relatives'], response: "Family relationships are important. How are things with your family?" },
  { keywords: ['friend', 'friends', 'social', 'hangout'], response: "Friends make life better! How's your social life?" },
  { keywords: ['health', 'exercise', 'fitness', 'diet'], response: "Taking care of your health is crucial. How's your wellness journey?" },
  { keywords: ['study', 'learn', 'education', 'school'], response: "Learning is a lifelong journey. What are you studying or interested in?" },
  { keywords: ['hobby', 'interest', 'passion', 'fun'], response: "Having hobbies is great! What do you enjoy doing in your free time?" }
];

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
    { id: 1, sender: 'Alice', text: "Hi, I'm Alice! I'm here to chat and help. How are you feeling today?", timestamp: '10:00 AM' }
  ];
  
  const [messages, setMessages] = useState(initialMessages);
  const [conversationState, setConversationState] = useState('greeting');
  const [isTyping, setIsTyping] = useState(false);
  const [lastTopic, setLastTopic] = useState(null);

  const addMessage = (sender, text, timestamp) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text, timestamp }]);
  };

  const analyzeMessage = (message, history) => {
    const doc = nlp(message);
    const lower = message.toLowerCase();

    // Entity recognition
    if (doc.people().length) {
      return `You mentioned ${doc.people().out('text')}. Are they important to you?`;
    }
    if (doc.places().length) {
      return `I've heard of ${doc.places().out('text')}. Have you been there recently?`;
    }
    if (doc.dates().length) {
      return `You mentioned a date: ${doc.dates().out('text')}. Is something special happening then?`;
    }
    if (doc.organizations().length) {
      return `You mentioned ${doc.organizations().out('text')}. Do you work with them?`;
    }
    if (doc.numbers().length) {
      return `You mentioned the number ${doc.numbers().out('text')}. Does it have any special meaning?`;
    }

    // Question detection
    if (doc.has('#Question') || message.trim().endsWith('?')) {
      return "That's a great question! What do you think?";
    }

    // Sentiment cues
    if (doc.has('happy') || doc.has('excited') || doc.has('love')) {
      return "I'm glad to hear that! What made you feel this way?";
    }
    if (doc.has('sad') || doc.has('angry') || doc.has('upset')) {
      return "I'm sorry to hear that. Want to talk about it?";
    }

    // Topic extraction (noun detection)
    const nouns = doc.nouns().out('array');
    if (nouns.length) {
      return `Let's talk about ${nouns[0]}. What interests you about it?`;
    }

    // Pattern matching (custom intent)
    if (doc.match('tell me a joke').found) {
      return "Why don't scientists trust atoms? Because they make up everything!";
    }
    if (doc.match('fun fact').found) {
      return "Did you know? Octopuses have three hearts!";
    }

    // Fallback
    return "I'm here to chat about anything! Tell me more or ask me something specific.";
  };

  const getResponse = (userMessage, currentState) => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let nextState = currentState;

    if (currentState === 'greeting') {
      response = analyzeMessage(userMessage, messages);
      nextState = 'general_chat';
    } else {
      response = analyzeMessage(userMessage, messages);
      nextState = 'general_chat';
    }

    return { response, nextState };
  };

  const triggerFriendResponse = (userMessage) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsTyping(true);
    const context = [...messages, { sender: 'Me', text: userMessage }];
    const response = analyzeMessage(userMessage, context);
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
