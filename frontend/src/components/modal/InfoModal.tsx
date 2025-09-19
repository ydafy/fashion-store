import React, { useRef, useEffect, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';
import AuthButton from '../auth/AuthButton';

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  image?: ReactNode; // Para poder pasar el SVG de la tarjeta
}

const InfoModal: React.FC<InfoModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  image,
}) => {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

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
      snapPoints={['50%']} // Un snap point más bajo para un modal informativo
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.modalHandle}
      backgroundStyle={{ backgroundColor: COLORS.primaryBackground }}
    >
      <BottomSheetView style={styles.contentContainer}>
        {image && <View style={styles.imageContainer}>{image}</View>}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <AuthButton
          title={t('common:accept')}
          onPress={onClose}
          style={styles.button}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalHandle: { backgroundColor: COLORS.separator, width: 50 },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
    padding: moderateScale(24),
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: verticalScale(12),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  message: {
    fontSize: moderateScale(16),
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: moderateScale(24),
    marginBottom: verticalScale(24),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  button: {
    width: '100%',
    marginTop: 'auto', // Empuja el botón hacia abajo
  },
});

export default InfoModal;
