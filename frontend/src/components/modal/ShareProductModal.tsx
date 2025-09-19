import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Linking,
  Alert,
  Platform
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import {
  ChatTeardropTextIcon,
  DotsThreeCircleIcon,
  CaretRightIcon
} from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';

import { useShareModal } from '../../contexts/ShareModalContext';
import ShareProductPreview from '../share/ShareProductPreview';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import Toast from 'react-native-toast-message';

const PRODUCT_BASE_URL = 'https://tu-ecommerce.com/producto/';

const ShareProductModal: React.FC = () => {
  const { isShareModalVisible, shareData, closeShareModal } = useShareModal();
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => [verticalScale(300)], []);

  useEffect(() => {
    if (isShareModalVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isShareModalVisible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) closeShareModal();
    },
    [closeShareModal]
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
    []
  );

  // --- ✨ Lógica de Compartir Simplificada ✨ ---
  const handleShare = useCallback(
    async (shareType: 'messages' | 'other') => {
      if (!shareData) return;
      const { product, productName } = shareData;

      const productUrl = `${PRODUCT_BASE_URL}${product.id}`;
      const message = t('product:share.shareMessage', {
        productName,
        productUrl
      });
      const shareTitle = t('product:share.shareTitle', { productName });

      // Si es "Otro", usa siempre la API nativa de Share.
      if (shareType === 'other') {
        try {
          await Share.share({ message, url: productUrl, title: shareTitle });
        } catch (error: any) {
          Alert.alert(t('product:share.modal.shareErrorTitle'), error.message);
        }
        return;
      }

      // Si es "Mensajes", intenta usar Linking y si falla, usa la API de Share.
      if (shareType === 'messages') {
        const smsUrl = Platform.select({
          ios: `sms:&body=${encodeURIComponent(message)}`,
          android: `sms:?body=${encodeURIComponent(message)}`,
          default: ''
        });

        try {
          const supported = await Linking.canOpenURL(smsUrl);
          if (supported) {
            await Linking.openURL(smsUrl);
            closeShareModal();
          } else {
            throw new Error('Cannot open messages app.'); // Forzamos el fallback
          }
        } catch (error) {
          // Fallback a la API nativa de Share si Linking falla
          Toast.show({
            type: 'info',
            text1: t('product:share.modal.usingGenericShare')
          });
          try {
            await Share.share({ message, url: productUrl, title: shareTitle });
          } catch (shareError: any) {
            Alert.alert(
              t('product:share.modal.shareErrorTitle'),
              shareError.message
            );
          }
        }
      }
    },
    [shareData, t, closeShareModal]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.modalHandle}
      backgroundStyle={{ backgroundColor: COLORS.primaryBackground }}
    >
      <BottomSheetView style={styles.modalContentContainer}>
        {shareData && (
          <ShareProductPreview
            product={shareData.product}
            productName={shareData.productName}
          />
        )}
        <View style={styles.separator} />

        {/* --- ✨ Botones con Accesibilidad y Lógica Simplificada ✨ --- */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleShare('messages')}
          accessibilityRole="button"
          accessibilityLabel={t('product:share.modal.messagesOption')}
        >
          <ChatTeardropTextIcon
            size={moderateScale(26)}
            color={COLORS.orderDelivered}
            weight="regular"
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>
            {t('product:share.modal.messagesOption')}
          </Text>
          <CaretRightIcon
            size={moderateScale(26)}
            color={COLORS.primaryText}
            weight="bold"
            style={styles.optionIcon}
          />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleShare('other')}
          accessibilityRole="button"
          accessibilityLabel={t('product:share.modal.otherOption')}
        >
          <DotsThreeCircleIcon
            size={moderateScale(26)}
            color={COLORS.primaryText}
            weight="regular"
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>
            {t('product:share.modal.otherOption')}
          </Text>
          <CaretRightIcon
            size={moderateScale(26)}
            color={COLORS.primaryText}
            weight="regular"
            style={styles.optionIcon}
          />
        </TouchableOpacity>

        <View style={styles.separator} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

// --- Estilos refinados ---
const styles = StyleSheet.create({
  modalHandle: { backgroundColor: COLORS.borderDefault, width: scale(40) },
  modalContentContainer: { flex: 1, paddingTop: verticalScale(10) },
  separator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginVertical: verticalScale(5),
    marginHorizontal: scale(15)
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15)
  },
  optionIcon: { marginRight: scale(15) },
  optionText: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText
  }
});

export default ShareProductModal;
