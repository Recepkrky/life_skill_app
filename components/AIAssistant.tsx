import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { 
  Send, 
  Bot, 
  X
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { aiService } from '@/utils/ai';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isVisible, onClose }: AIAssistantProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isVisible) {
      addWelcomeMessage();
    }
  }, [isVisible]);

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Merhaba! Ben senin kişisel asistanın. 🎯\n\nSenaryolarındaki ilerlemeni analiz edebilir, öneriler sunabilir ve sorularını yanıtlayabilirim.\n\nNasıl yardımcı olabilirim?`,
      isAI: true,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    console.log('Mesaj gönderiliyor:', inputText);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Gerçek AI yanıtı al
    try {
      console.log('AI servisi çağrılıyor...');
      const response = await aiService.generateResponse(inputText, user?.id || '');
      console.log('AI yanıtı alındı:', response);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.content,
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI yanıt hatası:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Özür dilerim, şu anda size yardımcı olamıyorum. Lütfen tekrar deneyin.',
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const testAPI = async () => {
    try {
      console.log('API test ediliyor...');
      const isWorking = await aiService.testAPI();
      const testMessage: Message = {
        id: Date.now().toString(),
        text: isWorking ? '✅ API bağlantısı çalışıyor!' : '❌ API bağlantısı hatası!',
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, testMessage]);
    } catch (error) {
      console.error('API test hatası:', error);
    }
  };

  const getProgressAnalysis = async () => {
    try {
      setIsTyping(true);
      const analysis = await aiService.analyzeUserProgress(user?.id || '');
      
      const analysisMessage: Message = {
        id: Date.now().toString(),
        text: analysis.analysis,
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('İlerleme analizi hatası:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const getPersonalRecommendations = async () => {
    try {
      setIsTyping(true);
      const analysis = await aiService.analyzeUserProgress(user?.id || '');
      
      let recommendationsText = '💡 **Kişisel Önerileriniz:**\n\n';
      
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        analysis.recommendations.forEach((rec, index) => {
          recommendationsText += `${index + 1}. ${rec}\n`;
        });
      }
      
      if (analysis.nextSteps && analysis.nextSteps.length > 0) {
        recommendationsText += '\n🎯 **Sonraki Adımlar:**\n';
        analysis.nextSteps.forEach((step, index) => {
          recommendationsText += `${index + 1}. ${step}\n`;
        });
      }
      
      const recommendationsMessage: Message = {
        id: Date.now().toString(),
        text: recommendationsText,
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, recommendationsMessage]);
    } catch (error) {
      console.error('Öneriler hatası:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isAI ? styles.aiMessage : styles.userMessage
    ]}>
      <View style={[
        styles.messageBubble,
        message.isAI ? styles.aiBubble : styles.userBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isAI ? styles.aiText : styles.userText
        ]}>
          {message.text}
        </Text>
      </View>
      <View style={styles.messageInfo}>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E293B', '#334155']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Bot size={24} color="#FFFFFF" />
              <Text style={styles.headerTitle}>AI Asistan</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={getProgressAnalysis}
              >
                <Text style={styles.actionButtonText}>📊 Analiz</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={getPersonalRecommendations}
              >
                <Text style={styles.actionButtonText}>💡 Öneriler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.testButton}
                onPress={testAPI}
              >
                <Text style={styles.testButtonText}>Test</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          >
            {messages.map(renderMessage)}
            {isTyping && (
              <View style={[styles.messageContainer, styles.aiMessage]}>
                <View style={[styles.messageBubble, styles.aiBubble]}>
                  <Text style={[styles.messageText, styles.aiText]}>
                    Yazıyor...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputContainer}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Mesajınızı yazın..."
                placeholderTextColor="#94A3B8"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  aiBubble: {
    backgroundColor: '#475569',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: '#FFFFFF',
  },
  userText: {
    color: '#FFFFFF',
  },
  messageInfo: {
    marginTop: 4,
    paddingHorizontal: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#475569',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#475569',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#64748B',
  },
});