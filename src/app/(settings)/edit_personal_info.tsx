import CustomAlert from '@/src/components/atoms/CustomAlert';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Icon } from '../../constants/icons';
import { getColorsByTheme } from '../../constants/themeColors';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../utils/contexts/ThemeContext';

const EditPersonalInfo = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [nombre, setNombre] = useState(user?.firstName || '');
  const [apellido, setApellido] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.phoneNumber || '');
  const [image, setImage] = useState<string | undefined>(user?.image || undefined);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{visible: boolean, type: 'success' | 'error', message: string}>({visible: false, type: 'success', message: ''});
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);
  const styles = getStyles(COLOR);

  const requestPermission = async (type: 'camera' | 'media') => {
    let status;
    if (type === 'camera') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      status = cameraStatus;
    } else {
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      status = mediaStatus;
    }
    if (status !== 'granted') {
      setAlert({
        visible: true,
        type: 'error',
        message: type === 'camera'
          ? 'Necesitamos permiso para acceder a tu cámara. Por favor, actívalo en la configuración de tu dispositivo.'
          : 'Necesitamos permiso para acceder a tus fotos. Por favor, actívalo en la configuración de tu dispositivo.'
      });
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission('media');
    if (!hasPermission) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission('camera');
    if (!hasPermission) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser({ 
        firstName: nombre, 
        lastName: apellido, 
        displayName: `${nombre} ${apellido}`,
        email, 
        phoneNumber: telefono, 
        image: image || undefined 
      });
      setAlert({
        visible: true,
        type: 'success',
        message: (image && (!user?.image || image !== user?.image))
          ? '¡Tu foto de perfil se guardó correctamente!'
          : 'Datos actualizados correctamente',
      });
      // Espera un poco antes de volver atrás para que el usuario vea el mensaje
      setTimeout(() => {
        setAlert(a => ({ ...a, visible: false }));
        router.back();
      }, 1800);
    } catch (e) {
      console.error('Error al guardar:', e);
      setAlert({
        visible: true,
        type: 'error',
        message: 'No se pudieron guardar los cambios',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(settings)/profile')}>
          <Icon name="arrow-left" size={22} color={COLOR.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Información</Text>
      </View>
      <View style={styles.body}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          {image ? (
            <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 8 }} />
          ) : (
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLOR.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Icon name="account-outline" size={48} color={COLOR.icon} />
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={pickImage} style={{ backgroundColor: COLOR.primary, borderRadius: 8, padding: 8, marginRight: 8 }}>
              <Text style={{ color: COLOR.textPrimary, fontWeight: 'bold' }}>Subir foto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={{ backgroundColor: COLOR.primary, borderRadius: 8, padding: 8 }}>
              <Text style={{ color: COLOR.textPrimary, fontWeight: 'bold' }}>Tomar foto</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
          placeholderTextColor={COLOR.textSecondary}
        />
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          value={apellido}
          onChangeText={setApellido}
          placeholder="Apellido"
          placeholderTextColor={COLOR.textSecondary}
        />
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Correo Electrónico"
          placeholderTextColor={COLOR.textSecondary}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Teléfono"
          placeholderTextColor={COLOR.textSecondary}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={[styles.saveButton, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>
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

const getStyles = (COLOR: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(18),
    paddingTop: verticalScale(32)
  },
  backButton: {
    marginRight: moderateScale(12),
    backgroundColor: COLOR.surface,
    borderRadius: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  body: {
    marginTop: verticalScale(12),
  },
  label: {
    color: COLOR.textSecondary,
    fontSize: moderateScale(14),
    marginBottom: 4,
    marginTop: verticalScale(12),
  },
  input: {
    backgroundColor: COLOR.surface,
    color: COLOR.textPrimary,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(16),
  },
  saveButton: {
    backgroundColor: COLOR.primary,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  saveButtonText: {
    color: COLOR.textPrimary,
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});

export default EditPersonalInfo;