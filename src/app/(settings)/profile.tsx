import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Icon } from '../../constants/icons';
import { getColorsByTheme } from '../../constants/themeColors';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../utils/contexts/ThemeContext';

const Profile = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);

  const handleLogoutPress = async () => {
    await signOut();
    router.push('/(settings)/logout');
  };

  return (
    <SafeAreaView style={getStyles(COLOR).container}>
      {/* Header con gradiente y avatar */}
      <LinearGradient colors={[COLOR.primary, COLOR.primaryDark]} style={getStyles(COLOR).headerGradient}>
        <View style={getStyles(COLOR).avatarCircle}>
          {user?.image ? (
            <Image source={{ uri: user.image }} style={{ width: moderateScale(90), height: moderateScale(90), borderRadius: moderateScale(45) }} />
          ) : (
            <Icon name="account-circle-outline" size={moderateScale(60)} color={COLOR.icon} />
          )}
        </View>
        <Text style={getStyles(COLOR).username}>{user?.displayName || user?.username || 'Usuario'}</Text>
        <Text style={[getStyles(COLOR).email, theme === 'light' && { color: '#000' }]}>{user?.email || 'correo@ejemplo.com'}</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
        {/* Información Personal */}
        <TouchableOpacity style={getStyles(COLOR).sectionBox} onPress={() => router.push('/(settings)/edit_personal_info')}>
          <View style={getStyles(COLOR).sectionRow}>
            <Icon name="account-outline" size={24} color={COLOR.icon} />
            <Text style={getStyles(COLOR).sectionText}>Información Personal</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Icon name="chevron-right" size={22} color={COLOR.icon} />
            </View>
          </View>
          <View style={getStyles(COLOR).infoPreview}>
            <Text style={getStyles(COLOR).infoLabel}>Nombre completo:</Text>
            <Text style={getStyles(COLOR).infoValue}>{user?.displayName || user?.username || 'Nombre'}</Text>
          </View>
          <View style={getStyles(COLOR).infoPreview}>
            <Text style={getStyles(COLOR).infoLabel}>Correo:</Text>
            <Text style={getStyles(COLOR).infoValue}>{user?.email || 'correo@ejemplo.com'}</Text>
          </View>
          <View style={getStyles(COLOR).infoPreview}>
            <Text style={getStyles(COLOR).infoLabel}>Teléfono:</Text>
            <Text style={getStyles(COLOR).infoValue}>{user?.phoneNumber || '-'}</Text>
          </View>
        </TouchableOpacity>
        {/* Notificaciones */}
        <View style={getStyles(COLOR).sectionBox}>
          <TouchableOpacity style={getStyles(COLOR).sectionRow} onPress={() => router.push('/(settings)/notificaciones')}>
            <Icon name="bell-outline" size={24} color={COLOR.icon} />
            <Text style={getStyles(COLOR).sectionText}>Notificaciones</Text>
          </TouchableOpacity>
        </View>
        {/* Mensajes */}
        <View style={getStyles(COLOR).sectionBox}>
          <TouchableOpacity style={getStyles(COLOR).sectionRow} onPress={() => router.push('/(settings)/mensajes')}>
            <Icon name="message-outline" size={24} color={COLOR.icon} />
            <Text style={getStyles(COLOR).sectionText}>Mensajes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Botón de logout/cambiar cuenta abajo a la derecha */}
      <TouchableOpacity style={getStyles(COLOR).logoutButtonBottom} onPress={handleLogoutPress}>
        <Icon name="logout" size={28} color={COLOR.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={getStyles(COLOR).rollbackButton} onPress={() => router.replace('/(tabs)/settings')}>
        <Icon name="arrow-left" size={22} color={COLOR.icon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

function getStyles(COLOR: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLOR.background,
    },
    headerGradient: {
      alignItems: 'center',
      paddingTop: verticalScale(40),
      paddingBottom: verticalScale(32),
      borderBottomLeftRadius: moderateScale(32),
      borderBottomRightRadius: moderateScale(32),
      marginBottom: verticalScale(18),
      position: 'relative',
    },
    avatarCircle: {
      width: moderateScale(90),
      height: moderateScale(90),
      borderRadius: moderateScale(45),
      backgroundColor: COLOR.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: verticalScale(10),
      borderWidth: 3,
      borderColor: COLOR.primaryLight,
    },
    username: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(22),
      fontWeight: 'bold',
      marginBottom: 2,
    },
    email: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(14),
      marginBottom: 8,
    },
    sectionBox: {
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(14),
      marginHorizontal: moderateScale(18),
      marginBottom: verticalScale(14),
      padding: moderateScale(14),
      elevation: 2,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      marginBottom: verticalScale(6),
    },
    sectionText: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
      textAlign: 'left',
      flex: 1,
    },
    infoPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalScale(2),
      marginLeft: scale(32),
      gap: scale(6),
    },
    infoLabel: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(14),
      minWidth: 60,
    },
    infoValue: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(14),
    },
    logoutButtonBottom: {
      position: 'absolute',
      bottom: verticalScale(32),
      right: moderateScale(32),
      backgroundColor: COLOR.surfaceLight,
      borderRadius: moderateScale(32),
      width: moderateScale(56),
      height: moderateScale(56),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
    rollbackButton: {
      position: 'absolute',
      top: verticalScale(32),
      left: moderateScale(32),
      backgroundColor: COLOR.surfaceLight,
      borderRadius: moderateScale(32),
      width: moderateScale(56),
      height: moderateScale(56),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
  });
}

export default Profile;