import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Text } from 'react-native';

function RootLayoutContent() {
  const { user, loading } = useAuth();
  useFrameworkReady();

  useEffect(() => {
    if (!loading) {
      // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
      if (!user) {
        router.replace('auth/login' as any);
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: '#2C3E50', fontSize: 18 }}>Yükleniyor...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
      style={{ flex: 1 }}
    >
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </LinearGradient>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}