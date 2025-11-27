import ButtonComponent from '@/src/components/atoms/ButtonComponent';
import CustomAlert from '@/src/components/atoms/CustomAlert';
import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const [alert, setAlert] = useState<{visible: boolean, type: 'success' | 'error', message: string}>({visible: false, type: 'success', message: ''});

  // Lógica de login
const handleLogin = async () => {
  if (!email || !password) {
    setAlert({
      visible: true,
      type: 'error',
      message: 'Por favor completa todos los campos.',
    });
    return;
  }

  try {
    await signIn(email, password);
    
    setAlert({
      visible: true,
      type: 'success',
      message: '¡Bienvenido!',
    });
    
    setTimeout(() => {
      setAlert((a) => ({ ...a, visible: false }));
      router.replace('/(tabs)');
    }, 1200);
  } catch (error: any) {
    setAlert({
      visible: true,
      type: 'error',
      message: error.message || 'Error al iniciar sesión',
    });
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title}>Ingresar</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Icon name="email-outline" size={moderateScale(22)} color={COLOR.icon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor={COLOR.icon}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          
            <View style={styles.inputRow}>
              <Icon name="lock-outline" size={moderateScale(22)} color={COLOR.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={COLOR.icon}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={moderateScale(22)}
                color={COLOR.icon}
              />
              </TouchableOpacity>
            </View>
            {/* Reemplazar el botón de ingresar */}
            <ButtonComponent title="Ingresar" onPress={handleLogin} />
          </View>
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Soy nuevo usuario. </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/register_page')}>
              <Text style={styles.registerLink}>Registrarme</Text>
            </TouchableOpacity>
          </View>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.socialText}>O puedes ingresar con:</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity>
            <Image
              source={require('@/src/assets/images/google.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('@/src/assets/images/github.png')}
              style={styles.socialIcon}
              tintColor={'#ffffff'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(a => ({...a, visible: false}))}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    paddingHorizontal: moderateScale(24),
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: verticalScale(32),
  },
  title: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    marginBottom: verticalScale(24),
  },
  inputContainer: {
    alignItems: 'center',
    gap: moderateScale(18),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  icon: {
    width: moderateScale(22),
    height: moderateScale(22),
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    paddingVertical: verticalScale(12),
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(18),
  },
  registerText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(15),
  },
  registerLink: {
    color: COLOR.primary,
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  socialText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(15),
    marginBottom: verticalScale(18),
  },
  socialIcons: {
    flexDirection: 'row',
    gap: scale(24),
  },
  socialIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    marginHorizontal: scale(12),
  },
});

export default LoginPage;