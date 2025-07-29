import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (isSignUp && !name) {
      Alert.alert('Hata', 'Lütfen adınızı girin');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        Alert.alert('Başarılı', 'Hesabınız oluşturuldu! Giriş yapabilirsiniz.');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
              colors={['#4A90E2', '#357ABD']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form Container */}
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.formContainer}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🎯</Text>
              <Text style={styles.appName}>Yaşam Becerileri</Text>
              <Text style={styles.appDescription}>
                Günlük yaşam becerilerini öğren ve geliştir
              </Text>
            </View>

            {/* Name Input (Sign Up only) */}
            {isSignUp && (
              <View style={styles.inputContainer}>
                <User size={20} color="#6C757D" />
                <TextInput
                  style={styles.input}
                  placeholder="Adınız"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#ADB5BD"
                />
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Mail size={20} color="#6C757D" />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#ADB5BD"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6C757D" />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#ADB5BD"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6C757D" />
                ) : (
                  <Eye size={20} color="#6C757D" />
                )}
              </TouchableOpacity>
            </View>

            {/* Auth Button */}
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={loading}
            >
              <LinearGradient
                colors={['#4A90E2', '#357ABD']}
                style={styles.authButtonGradient}
              >
                <Text style={styles.authButtonText}>
                  {loading
                    ? 'Yükleniyor...'
                    : isSignUp
                    ? 'Hesap Oluştur'
                    : 'Giriş Yap'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Toggle Sign Up/Login */}
            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>
                {isSignUp
                  ? 'Zaten hesabınız var mı? Giriş yapın'
                  : 'Hesabınız yok mu? Kayıt olun'}
              </Text>
            </TouchableOpacity>

            {/* Guest Login */}
            {!isSignUp && (
              <TouchableOpacity
                onPress={() => router.replace('/(tabs)')}
                style={styles.guestButton}
              >
                <Text style={styles.guestButtonText}>
                  Misafir olarak devam et
                </Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    padding: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 48,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  eyeButton: {
    padding: 4,
  },
  authButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  authButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestButtonText: {
    color: '#6C757D',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
}); 