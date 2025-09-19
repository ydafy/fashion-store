import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import { useTranslation } from 'react-i18next';

// --- Tipos y Hooks ---
import { ProfileStackParamList } from '../../types/navigation';
import { useContentDocument } from '../../hooks/useContentDocument';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import DocumentSkeleton from '../../components/skeletons/DocumentSkeleton';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

// Definimos el tipo de la ruta para esta pantalla
type LegalDocumentScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'LegalDocument' // Asumiremos que así se llamará en el StackNavigator
>;

const LegalDocumentScreen = () => {
  const { t } = useTranslation(['profile', 'common']);
  const route = useRoute<LegalDocumentScreenRouteProp>();
  const { documentType } = route.params;

  // Obtenemos los datos usando nuestro hook
  const { data, isLoading, isError, refetch } =
    useContentDocument(documentType);

  // Determinamos el título de la pantalla dinámicamente
  const screenTitle =
    documentType === 'terms'
      ? t('profile:settings.terms')
      : t('profile:settings.privacy');

  // --- Renderizado Condicional ---
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (isError) {
      return (
        <ErrorDisplay
          message={t('common:errors.contentLoadError')}
          onRetry={refetch}
        />
      );
    }
    if (data) {
      return <Markdown style={markdownStyles}>{data}</Markdown>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title={screenTitle} showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading && <DocumentSkeleton />}
        {isError && (
          <ErrorDisplay
            message={t('common:errors.contentLoadError')}
            onRetry={refetch}
          />
        )}

        {data && <Markdown style={markdownStyles}>{data}</Markdown>}
      </ScrollView>
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  scrollContent: {
    padding: moderateScale(20),
  },
});

// ✨ ESTILOS PARA EL COMPONENTE MARKDOWN ✨
// Esto nos permite aplicar nuestro sistema de diseño al contenido renderizado.
const markdownStyles = StyleSheet.create({
  heading1: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(24),
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    paddingBottom: verticalScale(8),
  },
  heading2: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(20),
    color: COLORS.primaryText,
    fontWeight: '600',
    marginTop: verticalScale(24),
    marginBottom: verticalScale(8),
  },
  body: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(16),
    color: COLORS.secondaryText,
    lineHeight: moderateScale(24),
  },
  strong: {
    fontWeight: 'bold',
    color: COLORS.primaryText,
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
  },
  bullet_list_icon: {
    marginRight: scale(8),
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
  },
});

export default LegalDocumentScreen;
