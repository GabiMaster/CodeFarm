import { Icon } from '@/src/constants/icons';
import { useAuth } from '@/src/hooks/useAuth';
import { useProjectContext } from '@/src/utils/contexts/ProjectContext';
import { useSidebarContext } from '@/src/utils/contexts/SidebarContext';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { getColorsByTheme } from '../../constants/themeColors';
import { useTheme } from '../../utils/contexts/ThemeContext';

const Home = () => {
  const { user } = useAuth();
  const { importFile, updateFiles, openSidebar, changeView } = useSidebarContext();
  const { recentProjects, openProject, refreshRecentProjects } = useProjectContext();
  const { theme } = useTheme();
  const COLOR = getColorsByTheme(theme);

  // Cargar proyectos recientes al montar el componente
  useEffect(() => {
    refreshRecentProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo cargar una vez al montar

  // Función para importar archivo
  const handleImportFile = async () => {
    try {
      await importFile();
      Alert.alert('✅ Archivo Importado', 'El archivo se importó correctamente y está disponible en el editor.');
      // Navegar al editor
      router.push('/(editor)/editor');
    } catch {
      Alert.alert('❌ Error', 'No se pudo importar el archivo. Inténtalo de nuevo.');
    }
  };

  // Función para clonar repositorio Git
  const handleCloneRepository = () => {
    console.log('🔧 Home: handleCloneRepository called');
    
    // Primero cambiar la vista de la sidebar a Git
    changeView('git');
    openSidebar();
    
    // Luego navegar al editor donde se puede ver la sidebar
    router.push('/(editor)/editor');
    
    console.log('✅ Home: Navigated to editor with Git view');
  };

  // Función para abrir un proyecto reciente
  const handleOpenRecentProject = async (projectId: string) => {
    try {
      // Buscar el proyecto completo por ID
      const ProjectManager = (await import('@/src/utils/project/ProjectManager')).ProjectManager;
      const project = await ProjectManager.getProjectById(projectId);
      
      if (project) {
        const openedProject = await openProject(project);
        
        // Actualizar la sidebar con los archivos del proyecto
        if (openedProject.fileStructure && openedProject.fileStructure.length > 0) {
          updateFiles(openedProject.fileStructure);
        }
        
        router.push('/(editor)/editor');
      } else {
        Alert.alert('Error', 'No se pudo encontrar el proyecto.');
      }
    } catch (error) {
      console.error('❌ Error opening recent project:', error);
      Alert.alert('Error', 'No se pudo abrir el proyecto. Inténtalo de nuevo.');
    }
  };

  const getLanguageIcon = (language?: string) => {
    switch (language?.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'language-javascript';
      case 'typescript':
      case 'ts':
        return 'language-typescript';
      case 'python':
      case 'py':
        return 'language-python';
      case 'java':
        return 'language-java';
      case 'html':
        return 'language-html5';
      case 'css':
        return 'language-css3';
      case 'react':
        return 'react';
      default:
        return 'file-code-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace unos minutos';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <SafeAreaView style={getStyles(COLOR).container}>
      {/* Header */}
      <View style={getStyles(COLOR).header}>
        <View style={getStyles(COLOR).headerLeft}>
          <View style={getStyles(COLOR).avatarCircle}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={{ width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24) }} />
            ) : (
              <Icon name="account-circle-outline" size={moderateScale(38)} color={COLOR.icon} />
            )}
          </View>
          <View style={[getStyles(COLOR).headerTextContainer, { marginLeft: 8 }]}>
            <Text style={[getStyles(COLOR).welcomeText, { marginBottom: 2 }]}>Bienvenido</Text>
            <Text style={getStyles(COLOR).usernameText}>{user?.firstName || user?.displayName?.split(' ')[0] || user?.username || 'Usuario'}</Text>
          </View>
        </View>
      </View>

      {/* Body con Scroll */}
      <ScrollView style={getStyles(COLOR).body} contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
        {/* Inicio */}
        <Text style={getStyles(COLOR).sectionTitle}>Inicio</Text>
        <View style={getStyles(COLOR).quickActions}>
          <TouchableOpacity
            style={getStyles(COLOR).quickAction}
            onPress={() => router.push({ pathname: '/(main)/new_project', params: { from: 'index' } })}
          >
            <Icon name="addfile" type="ant" size={moderateScale(32)} color={COLOR.primary} />
            <Text style={getStyles(COLOR).quickActionText}>Nuevo Proyecto...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getStyles(COLOR).quickAction}
            onPress={handleImportFile}
          >
            <Icon name="file-open" type='materialIcons' size={moderateScale(32)} color={COLOR.primary} />
            <Text style={getStyles(COLOR).quickActionText}>Abrir Archivo...</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={getStyles(COLOR).quickAction}
            onPress={handleCloneRepository}
          >
            <Icon name="source-branch" size={moderateScale(32)} color={COLOR.primary} />
            <Text style={getStyles(COLOR).quickActionText}>Clonar Repositorio Git...</Text>
          </TouchableOpacity>
        </View>

        {/* Actividad Reciente */}
        <Text style={getStyles(COLOR).sectionTitle}>Actividad Reciente</Text>
        {recentProjects.length === 0 ? (
          <View style={getStyles(COLOR).emptyRecentActivity}>
            <Icon name="history" size={moderateScale(32)} color={COLOR.textSecondary} />
            <Text style={getStyles(COLOR).emptyText}>No hay proyectos recientes</Text>
            <Text style={getStyles(COLOR).emptySubtext}>
              Los proyectos que abras aparecerán aquí
            </Text>
          </View>
        ) : (
          <View style={getStyles(COLOR).recentActivityList}>
            {recentProjects.slice(0, 5).map((project) => (
              <TouchableOpacity
                key={project.id}
                style={getStyles(COLOR).recentActivity}
                onPress={() => handleOpenRecentProject(project.id)}
                activeOpacity={0.7}
              >
                <View style={getStyles(COLOR).recentProjectIcon}>
                  <Icon 
                    name={getLanguageIcon(project.language)} 
                    size={moderateScale(24)} 
                    color={COLOR.primary} 
                  />
                </View>
                <View style={getStyles(COLOR).activityTextContainer}>
                  <Text style={getStyles(COLOR).activityTitle} numberOfLines={1}>
                    {project.name}
                  </Text>
                  <Text style={getStyles(COLOR).activitySubtitle}>
                    Última vez editado {formatDate(project.lastModified)}
                  </Text>
                </View>
                <Icon 
                  name="chevron-right" 
                  size={moderateScale(18)} 
                  color={COLOR.textSecondary} 
                />
              </TouchableOpacity>
            ))}
            
            {recentProjects.length > 5 && (
              <TouchableOpacity 
                style={getStyles(COLOR).viewAllButton}
                onPress={() => router.push('/(tabs)/projects')}
              >
                <Text style={getStyles(COLOR).viewAllText}>
                  Ver todos los proyectos ({recentProjects.length})
                </Text>
                <Icon 
                  name="arrow-right" 
                  size={moderateScale(16)} 
                  color={COLOR.primary} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Lenguajes más utilizados */}
        <Text style={getStyles(COLOR).sectionTitle}>Lenguajes más utilizados</Text>
        <View style={getStyles(COLOR).languagesList}>
          <View style={getStyles(COLOR).languageItem}>
            <Image
              source={require('@/src/assets/images/python.png')}
              style={getStyles(COLOR).languageIcon}
            />
            <View>
              <Text style={getStyles(COLOR).languageName}>Python</Text>
              <Text style={getStyles(COLOR).languageTime}>20hs en la ultima semana</Text>
            </View>
          </View>
          <View style={getStyles(COLOR).languageItem}>
            <Image
              source={require('@/src/assets/images/java.png')}
              style={getStyles(COLOR).languageIcon}
            />
            <View>
              <Text style={getStyles(COLOR).languageName}>Java</Text>
              <Text style={getStyles(COLOR).languageTime}>14hs en la ultima semana</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; // ← Este cierra el componente Home

function getStyles(COLOR: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLOR.background,
      paddingHorizontal: moderateScale(20),
      paddingTop: verticalScale(16),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: verticalScale(6),
      paddingTop: verticalScale(32),
      marginBottom: verticalScale(18),
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarCircle: {
      width: moderateScale(48),
      height: moderateScale(48),
      borderRadius: moderateScale(24),
      backgroundColor: COLOR.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: scale(10),
    },
    headerTextContainer: {
      justifyContent: 'center',
    },
    welcomeText: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(14),
    },
    usernameText: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(18),
      fontWeight: 'bold',
    },
    headerRight: {},
    searchCircle: {
      width: moderateScale(38),
      height: moderateScale(38),
      borderRadius: moderateScale(19),
      backgroundColor: COLOR.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      flex: 1,
    },
    sectionTitle: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(15),
      marginTop: verticalScale(18),
      marginBottom: verticalScale(8),
      fontWeight: 'bold',
    },
    quickActions: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: scale(18),
      marginBottom: verticalScale(18),
    },
    quickAction: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(12),
      paddingHorizontal: moderateScale(14),
      marginRight: scale(12),
      gap: scale(10),
    },
    quickActionText: {
      color: COLOR.primary,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    recentActivity: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(12),
      paddingHorizontal: moderateScale(14),
      marginRight: scale(12),
      marginBottom: verticalScale(18),
      gap: scale(10),
    },
    emptyRecentActivity: {
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(20),
      paddingHorizontal: moderateScale(14),
      alignItems: 'center',
      marginBottom: verticalScale(18),
    },
    emptyText: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
      fontWeight: '600',
      marginTop: verticalScale(8),
      textAlign: 'center',
    },
    emptySubtext: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(14),
      marginTop: verticalScale(4),
      textAlign: 'center',
    },
    recentActivityList: {
      marginBottom: verticalScale(18),
    },
    recentProjectIcon: {
      width: moderateScale(40),
      height: moderateScale(40),
      borderRadius: moderateScale(20),
      backgroundColor: COLOR.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(8),
      paddingVertical: verticalScale(10),
      paddingHorizontal: moderateScale(16),
      marginTop: verticalScale(8),
    },
    viewAllText: {
      color: COLOR.primary,
      fontSize: moderateScale(14),
      fontWeight: '600',
      marginRight: moderateScale(8),
    },
    languagesList: {
      marginTop: verticalScale(8),
      gap: verticalScale(10),
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLOR.surface,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(10),
      paddingHorizontal: moderateScale(14),
      marginRight: scale(12),
      marginBottom: verticalScale(8),
      gap: scale(10),
    },
    languageIcon: {
      width: moderateScale(38),
      height: moderateScale(38),
      marginRight: scale(10),
    },
    languageName: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    languageTime: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(13),
    },
    activityTextContainer: {
      flex: 1,
      marginLeft: moderateScale(12),
    },
    activityTitle: {
      color: COLOR.textPrimary,
      fontSize: moderateScale(16),
      fontWeight: '600',
    },
    activitySubtitle: {
      color: COLOR.textSecondary,
      fontSize: moderateScale(13),
      marginTop: verticalScale(2),
    },
  });
};

export default Home;