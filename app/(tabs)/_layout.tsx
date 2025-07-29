import { Tabs } from 'expo-router';
import { Trophy, BookOpen, User, Settings, MessageCircle, LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import AIAssistant from '@/components/AIAssistant';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const [showAI, setShowAI] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
                      tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: 'rgba(74, 144, 226, 0.6)',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            height: 90,
            paddingBottom: 25,
            paddingTop: 15,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ size, color }) => (
              <View style={styles.iconContainer}>
                <Trophy size={size} color={color} strokeWidth={2} fill={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="scenarios"
          options={{
            title: 'Senaryolar',
            tabBarIcon: ({ size, color }) => (
              <View style={styles.iconContainer}>
                <BookOpen size={size} color={color} strokeWidth={2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="ai-assistant"
          options={{
            title: 'AI Asistan',
            tabBarIcon: ({ size, color }) => (
              <View style={styles.iconContainer}>
                <MessageCircle size={size} color={color} strokeWidth={2} />
              </View>
            ),
<<<<<<< HEAD
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => setShowAI(true)}
                style={styles.aiButton}
              />
            ),
=======
>>>>>>> integrate-master
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ size, color }) => (
              <View style={styles.iconContainer}>
                <User size={size} color={color} strokeWidth={2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ayarlar',
            tabBarIcon: ({ size, color }) => (
              <View style={styles.iconContainer}>
                <Settings size={size} color={color} strokeWidth={2} />
              </View>
            ),
          }}
        />
      </Tabs>
      
      <AIAssistant 
<<<<<<< HEAD
        visible={showAI} 
=======
        isVisible={showAI} 
>>>>>>> integrate-master
        onClose={() => setShowAI(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  aiButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
});