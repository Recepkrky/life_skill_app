import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <View
      style={[
        styles.messageContainer,
        message.isAI ? styles.aiMessage : styles.userMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isAI ? styles.aiMessageBubble : styles.userMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isAI ? styles.aiMessageText : styles.userMessageText,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            message.isAI ? styles.aiTimestamp : styles.userTimestamp,
          ]}
        >
          {message.timestamp.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    maxWidth: '85%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
  },
  userMessageBubble: {
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  aiMessageText: {
    color: '#2C3E50',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  aiTimestamp: {
    color: '#7F8C8D',
  },
  userTimestamp: {
    color: '#FFFFFF',
  },
});