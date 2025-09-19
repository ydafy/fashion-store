import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useImagePicker = () => {
  const { t } = useTranslation('common');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /**
   * @description Solicita permisos y abre la galería de imágenes.
   */
  const pickImage = async () => {
    // Solicitamos permiso para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('errors.permissionDeniedTitle'),
        t('errors.galleryPermissionDenied'),
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permite al usuario recortar la imagen
      aspect: [1, 1], // Fuerza un recorte cuadrado, ideal para avatares
      quality: 0.8, // Comprime la imagen para optimizar la subida
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  /**
   * @description Solicita permisos y abre la cámara.
   */
  const takePhoto = async () => {
    // Solicitamos permiso para acceder a la cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('errors.permissionDeniedTitle'),
        t('errors.cameraPermissionDenied'),
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return {
    selectedImage,
    pickImage,
    takePhoto,
  };
};
