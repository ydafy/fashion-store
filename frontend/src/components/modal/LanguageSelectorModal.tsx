import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';
import { supportedLanguages, Language } from '../../config/languages';
import LanguageOption from '../profile/LanguageOption';

interface LanguageSelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Estado para el feedback de carga
  const [mutatingLanguage, setMutatingLanguage] = useState<string | null>(null);

  // Lógica del BottomSheet
  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  // Hook para mostrar el Toast y cerrar el modal DESPUÉS de que el idioma cambie
  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      // 'lng' es el nuevo código de idioma, ej: 'es'
      Toast.show({
        type: 'success',
        text1: t('profile:settings.languageChangedToast.title'),
        text2: t(
          lng === 'es'
            ? 'profile:settings.languageChangedToast.messageES'
            : 'profile:settings.languageChangedToast.messageEN',
        ),
      });

      // Damos tiempo al usuario para ver el Toast antes de cerrar
      setTimeout(() => {
        onClose();
        setMutatingLanguage(null); // Limpiamos el estado de carga
      }, 700);
    };

    i18n.on('languageChanged', onLanguageChanged);

    // Función de limpieza para evitar memory leaks
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [i18n, t, onClose]);

  const handleSelectLanguage = (language: Language) => {
    if (i18n.language !== language.code) {
      setMutatingLanguage(language.code); // Inicia el estado de carga
      i18n.changeLanguage(language.code); // Dispara el cambio
    }
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['35%']}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.modalHandle}
      backgroundStyle={{ backgroundColor: COLORS.primaryBackground }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>
          {t('profile:settings.languageModal.title')}
        </Text>
        <BottomSheetScrollView contentContainerStyle={styles.optionsWrapper}>
          {supportedLanguages.map((lang) => (
            <LanguageOption
              key={lang.code}
              language={lang}
              isSelected={i18n.language === lang.code}
              isMutating={mutatingLanguage === lang.code}
              onPress={handleSelectLanguage}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalHandle: { backgroundColor: COLORS.separator, width: 50 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  optionsWrapper: { paddingBottom: 100 },

  title: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default LanguageSelectorModal;
