import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CircleIcon } from 'phosphor-react-native';

import { Language } from '../../config/languages';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface LanguageOptionProps {
  language: Language;
  isSelected: boolean;
  isMutating: boolean;
  onPress: (language: Language) => void;
}

const LanguageOption: React.FC<LanguageOptionProps> = ({
  language,
  isSelected,
  isMutating,
  onPress,
}) => {
  const FlagIcon = language.flag;

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onPress(language)}
      disabled={isMutating}
      accessibilityRole="button"
      accessibilityLabel={language.name}
      accessibilityState={{ selected: isSelected, disabled: isMutating }}
    >
      <View style={styles.flagWrapper}>
        <FlagIcon width={30} height={30} />
      </View>
      <Text style={styles.nameText}>{language.name}</Text>

      <View style={styles.statusIconContainer}>
        {isMutating ? (
          <ActivityIndicator size="small" color={COLORS.accent} />
        ) : (
          <CircleIcon
            size={moderateScale(24)}
            color={isSelected ? COLORS.accent : COLORS.separator}
            weight={isSelected ? 'fill' : 'light'}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    minHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,

    borderBottomColor: COLORS.separator,
  },
  selectedContainer: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.warningBackground,
  },
  flagWrapper: {
    width: 28,
    height: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  statusIconContainer: {
    width: moderateScale(24),
    height: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LanguageOption;
