import React, { useRef } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useFormContext, Controller } from 'react-hook-form';

// --- Components and Types ---
import { COLORS } from '../../constants/colors';
import StyledTextInput from '../common/inputs/StyledTextInput';
import Checkbox from '../common/Checkbox';
import CardNumberInput from '../forms/CardNumberInput';
import MaskedTextInput from '../../components/common/inputs/MaskedTextInput';

const PaymentForm: React.FC = () => {
  const { t } = useTranslation();

  //  RHF: We get everything we need from the context.
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const cardNumberRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);

  return (
    <View>
      <Controller
        control={control}
        name="cardHolderName"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput
            label={t('payments:form.cardHolderName')}
            placeholder={t('payments:form.cardHolderPlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={
              errors.cardHolderName
                ? t(`errors:${errors.cardHolderName.message}`)
                : undefined
            }
            returnKeyType="next"
            onSubmitEditing={() => cardNumberRef.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name="cardNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <CardNumberInput
            ref={cardNumberRef}
            label={t('payments:form.cardNumber')}
            placeholder="0000 0000 0000 0000"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={
              errors.cardNumber
                ? t(`errors:${errors.cardNumber.message}`)
                : undefined
            }
            returnKeyType="next"
            onSubmitEditing={() => expiryRef.current?.focus()}
          />
        )}
      />
      <View style={styles.rowInputContainer}>
        <Controller
          control={control}
          name="cardExpiry"
          render={({ field: { onChange, onBlur, value } }) => (
            <MaskedTextInput
              ref={expiryRef}
              containerStyle={styles.inputHalf}
              label={t('payments:form.expiryDate')}
              placeholder={t('payments:form.expiryPlaceholder')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.cardExpiry
                  ? t(`errors:${errors.cardExpiry.message}`)
                  : undefined
              }
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => cvvRef.current?.focus()}
              mask={[/\d/, /\d/, '/', /\d/, /\d/]}
            />
          )}
        />
        <Controller
          control={control}
          name="cardCvv"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              ref={cvvRef}
              containerStyle={styles.inputHalf}
              label={t('payments:form.cvv')}
              placeholder="123"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.cardCvv
                  ? t(`errors:${errors.cardCvv.message}`)
                  : undefined
              }
              keyboardType="number-pad"
              returnKeyType="done"
              maxLength={4}
              secureTextEntry
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="saveCard"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            label={t('checkout:paymentForm.saveCardLabel')}
            isChecked={!!value}
            onPress={() => onChange(!value)}
            containerStyle={styles.checkboxItemContainer}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rowInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  checkboxItemContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
});

export default PaymentForm;
