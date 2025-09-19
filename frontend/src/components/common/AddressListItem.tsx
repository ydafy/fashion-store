import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import {
  MapPinIcon,
  StarIcon,
  PencilSimpleLineIcon,
  TrashIcon,
} from 'phosphor-react-native';

import { Address } from '../../types/address';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

export interface AddressListItemProps {
  address: Address;
  onPress: (address: Address) => void;
  onEditPress: (address: Address) => void;
  onDeletePress?: (address: Address) => void;
  onSetDefaultPress: (addressId: string) => void;
  isSelected?: boolean;
  isMutating?: boolean;
}

const AddressListItem: React.FC<AddressListItemProps> = ({
  address,
  onPress,
  onEditPress,
  onDeletePress,
  onSetDefaultPress,
  isSelected,
  isMutating = false,
}) => {
  const { t } = useTranslation();

  const handleSetDefault = (e: any) => {
    e.stopPropagation();
    onSetDefaultPress(address.id);
  };

  const accessibilityLabel = `${address.label}. ${
    address.isDefault ? t('address:listItem.isDefault') + '. ' : ''
  }${t('address:listItem.addressDetails')}: ${address.recipientName}, ${
    address.street
  }, ${address.city}. ${isSelected ? t('address:listItem.selected') : ''}`;

  return (
    <TouchableOpacity
      disabled={isMutating}
      style={[
        styles.outerContainer,
        isSelected && styles.selectedContainer,
        isMutating && styles.mutatingContainer,
      ]}
      onPress={() => onPress(address)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: !!isSelected, disabled: isMutating }}
    >
      <MapPinIcon
        size={moderateScale(26)}
        color={isSelected ? COLORS.accent : COLORS.secondaryText}
        weight={isSelected ? 'fill' : 'regular'}
        style={styles.locationIcon}
      />

      <View style={styles.textContainer}>
        {/* ✨ 1. NUEVO CONTENEDOR PARA EL LABEL Y LA ESTRELLA ✨ */}
        <View style={styles.labelContainer}>
          <Text style={[styles.label, isSelected && styles.selectedLabelText]}>
            {address.label}
          </Text>
          {address.isDefault && (
            <StarIcon
              size={moderateScale(16)}
              color={COLORS.warning}
              weight="fill"
              style={styles.starIcon}
              accessibilityLabel={t('address:listItem.isDefault')}
            />
          )}
        </View>

        <Text
          style={[styles.details, isSelected && styles.selectedDetailsText]}
        >
          {address.recipientName}
        </Text>
        <Text
          style={[styles.details, isSelected && styles.selectedDetailsText]}
        >
          {`${address.street}, ${address.city}`}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        {isMutating ? (
          <ActivityIndicator size="small" color={COLORS.primaryText} />
        ) : (
          <>
            {/* ✨ 2. BOTÓN PARA MARCAR COMO PREDETERMINADA (ahora aquí) ✨ */}
            {/* Solo se muestra si NO es la predeterminada */}
            {!address.isDefault && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSetDefault}
                accessibilityRole="button"
                accessibilityLabel={t('address:listItem.setDefault', {
                  label: address.label,
                })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <StarIcon
                  size={moderateScale(22)}
                  color={COLORS.secondaryText}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onEditPress(address);
              }}
              accessibilityRole="button"
              accessibilityLabel={t('address:listItem.editButtonLabel', {
                label: address.label,
              })}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <PencilSimpleLineIcon
                size={moderateScale(22)}
                color={COLORS.secondaryText}
              />
            </TouchableOpacity>

            {onDeletePress && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onDeletePress(address);
                }}
                accessibilityRole="button"
                accessibilityLabel={t('address:listItem.deleteButtonLabel', {
                  label: address.label,
                })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <TrashIcon size={moderateScale(22)} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

// --- ✨ 3. AJUSTES FINALES DE ESTILOS ✨ ---
const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    backgroundColor: COLORS.white,
  },
  selectedContainer: {
    backgroundColor: COLORS.lightGray,
    borderLeftWidth: moderateScale(4),
    borderLeftColor: COLORS.accent,
  },
  mutatingContainer: {
    opacity: 0.6,
    backgroundColor: '#f0f0f0',
  },
  locationIcon: {
    marginRight: moderateScale(15),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(2),
  },
  label: {
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
  },

  starIcon: {
    marginLeft: moderateScale(8),
  },
  details: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    lineHeight: moderateScale(20),
  },
  selectedLabelText: {
    fontWeight: '600',
  },
  selectedDetailsText: {
    color: COLORS.primaryText,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Alinear a la derecha
    paddingLeft: moderateScale(10),
    minWidth: moderateScale(120), // Ancho mínimo para acomodar 3 iconos
  },
  actionButton: {
    padding: moderateScale(8),
    marginLeft: moderateScale(4), // Espacio más pequeño entre iconos
  },
});

export default AddressListItem;
