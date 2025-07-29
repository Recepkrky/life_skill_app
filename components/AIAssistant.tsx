import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { MessageCircle, X, Send, Trophy, Star } from 'lucide-react-native';
import { aiService } from '@/utils/ai';
import { LinearGradient } from 'expo-linear-gradient';

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

export default function AIAssistant({ visible, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Merhaba! Ben senin AI asistanınım. Günlük yaşam becerileri hakkında sorularını cevaplayabilirim. Nasıl yardımcı olabilirim? 🎯",
      isAI: true,
      timestamp: new Date(),
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: text.trim(),
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiService.getGeneralHelp(text.trim());
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        text: response,
        isAI: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: "Özür dilerim, şu anda size yardımcı olamıyorum. Lütfen tekrar deneyin. 😔",
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.container}
      >
        {/* Header */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <MessageCircle size={24} color="#FFD93D" strokeWidth={2} />
              <Text style={styles.headerTitle}>AI Asistan</Text>
            </View>
            <Text style={styles.headerSubtitle}>Seni destekliyorum! 💪</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="rgba(255, 255, 255, 0.8)" strokeWidth={2} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isAI ? styles.aiMessage : styles.userMessage,
              ]}
            >
              <LinearGradient
                colors={
                  message.isAI 
                    ? ['#FFFFFF', '#F8F9FA']
                    : ['#FFD93D', '#FFB800']
                }
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
              </LinearGradient>
            </View>
          ))}
          
          {isLoading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <LinearGradient
                colors={['#FFFFFF', '#F8F9FA']}
                style={[styles.messageBubble, styles.aiMessageBubble]}
              >
                <View style={styles.loadingContainer}>
                  <Star size={16} color="#FFD93D" strokeWidth={2} fill="#FFD93D" />
                  <Text style={styles.loadingText}>Düşünüyor...</Text>
                </View>
              </LinearGradient>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.inputContainer}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Sorunuzu yazın..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() && styles.sendButtonActive,
              ]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
            >
              <LinearGradient
                colors={
                  inputText.trim() 
                    ? ['#FFD93D', '#FFB800']
                    : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']
                }
                style={styles.sendButtonGradient}
              >
                <Send size={18} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 32,
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 8,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aiMessageBubble: {
    borderBottomLeftRadius: 8,
  },
  userMessageBubble: {
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
    color: '#6C757D',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#6C757D',
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    // Gradient is handled in the component
  },
});