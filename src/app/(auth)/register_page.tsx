import ButtonComponent from '@/src/components/atoms/ButtonComponent';
import CustomAlert from '@/src/components/atoms/CustomAlert';
import { COLOR } from '@/src/constants/colors';
import { Icon } from '@/src/constants/icons';
import { useAuth } from '@/src/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const TERMS_TEXT = `
Estos son los términos y condiciones de uso de la aplicación. Aquí puedes colocar el texto legal que desees mostrar al usuario. 
Asegúrate de que el usuario pueda leer todo el contenido antes de aceptar.

1. El usuario acepta las condiciones de uso.
2. El usuario se compromete a utilizar la aplicación de forma responsable.
3. La empresa no se hace responsable por el mal uso de la aplicación.
...
`;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { signIn } = useAuth();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState<{visible: boolean, type: 'success' | 'error', message: string}>({visible: false, type: 'success', message: ''});

  const handleAcceptTerms = () => {
    setAcceptTerms(true);
    setShowTermsModal(false);
  };

  // Lógica de registro
const handleRegister = async () => {
  if (!displayName || !username || !email || !password || !confirmPassword) {
    setAlert({
      visible: true,
      type: 'error',
      message: 'Por favor completa todos los campos.',
    });
    return;
  }

  if (password !== confirmPassword) {
    setAlert({
      visible: true,
      type: 'error',
      message: 'Las contraseñas no coinciden.',
    });
    return;
  }

  try {
    await register({ displayName, username, email, password });
    setAlert({
      visible: true,
      type: 'success',
      message: '¡Registro exitoso!',
    });
    
    setTimeout(() => {
      setAlert((a) => ({ ...a, visible: false }));
      router.replace('/(tabs)');
    }, 1200);
  } catch (error: any) {
    setAlert({
      visible: true,
      type: 'error',
      message: error.message || 'Error al registrar usuario',
    });
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(auth)/login_page')}
        >
          <Icon name="arrow-left" size={moderateScale(22)} color={COLOR.icon} />
        </TouchableOpacity>
      </View>
      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title}>Registrarse</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Icon name="account-outline" size={moderateScale(22)} color={COLOR.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={COLOR.icon}
              autoCapitalize="words"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
          <View style={styles.inputRow}>
            <Icon name="account-outline" size={moderateScale(22)} color={COLOR.icon} />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor={COLOR.icon}
              autoCapitalize="words"
              value={apellido}
              onChangeText={setApellido}
            />
          </View>
          <View style={styles.inputRow}>
            <Icon name="phone-outline" size={moderateScale(22)} color={COLOR.icon} />
            <TextInput
              style={styles.input}
              placeholder="Número de telefono"
              placeholderTextColor={COLOR.icon}
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />
          </View>
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
          <View style={styles.inputRow}>
            <Icon name="lock-outline" size={moderateScale(22)} color={COLOR.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor={COLOR.icon}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={moderateScale(22)}
                color={COLOR.icon}
              />
            </TouchableOpacity>
          </View>
          {/* Términos y condiciones */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAcceptTerms(!acceptTerms)}
            activeOpacity={0.7}
          >
            <Icon
              name={acceptTerms ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
              size={moderateScale(22)}
              color={acceptTerms ? COLOR.primary : COLOR.icon}
            />
            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text
                style={styles.termsLink}
                onPress={e => {
                  e.stopPropagation?.();
                  setShowTermsModal(true);
                }}
              >
                términos y condiciones
              </Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!acceptTerms}
            style={[
              styles.buttonWrapper,
              !acceptTerms && { opacity: 0.5 }
            ]}
          >
            <ButtonComponent title="Registrarse" onPress={handleRegister} disabled={!acceptTerms} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Si ya tienes una cuenta.{' '}
          <Text
            style={styles.footerLink}
            onPress={() => router.replace('/(auth)/login_page')}
          >
            Ingresar
          </Text>
        </Text>
      </View>
      {/* Modal de Términos y Condiciones */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.termsScroll}>
              <Text style={styles.modalTitle}>Términos y condiciones</Text>
              <Text style={styles.modalText}>{TERMS_TEXT}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAcceptTerms}
            >
              <Text style={styles.acceptButtonText}>Acepto los términos y condiciones</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    height: verticalScale(60),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(50),
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLOR.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: verticalScale(8),
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
  input: {
    flex: 1,
    color: COLOR.textPrimary,
    fontSize: moderateScale(16),
    paddingVertical: verticalScale(12),
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(-10),
  },
  termsText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
    marginLeft: 8,
  },
  termsLink: {
    color: COLOR.primary,
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  footerText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(15),
  },
  footerLink: {
    color: COLOR.primary,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  modalContent: {
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    width: '100%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: moderateScale(12),
    alignSelf: 'center',
  },
  termsScroll: {
    marginBottom: moderateScale(16),
    width: '100%',
  },
  modalText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
    textAlign: 'justify',
  },
  acceptButton: {
    backgroundColor: COLOR.primary,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(8),
    width: '100%',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: COLOR.textPrimary,
    fontWeight: 'bold',
    fontSize: moderateScale(15),
  },
  closeButton: {
    paddingVertical: moderateScale(8),
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
  },
});

export default RegisterPage;