import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  AppDatePicker,
  AppHeader,
  formatDateOnly,
  Icon,
  Screen,
  useParsedPickerDate,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useNewRentalController} from './useController';

type Styles = ReturnType<typeof createStyles>;

function Field({
  styles,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  error,
}: {
  styles: Styles;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  secureTextEntry?: boolean;
  error?: string;
}) {
  const colors = useThemeColors();
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSoft}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error ? styles.inputError : null]}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

function DateField({
  styles,
  label,
  value,
  onChangeText,
  error,
}: {
  styles: Styles;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}) {
  const colors = useThemeColors();
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerValue = useParsedPickerDate(value);

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.dateInput, error ? styles.inputError : null]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="mm/dd/yyyy"
          placeholderTextColor={colors.textSoft}
          style={styles.dateText}
        />
        <Pressable
          onPress={() => setPickerOpen(true)}
          hitSlop={8}
          accessibilityLabel="Open calendar">
          <Icon name="calendarField" size={11} color={colors.textSoft} />
        </Pressable>
      </View>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
      <AppDatePicker
        visible={pickerOpen}
        value={pickerValue}
        onClose={() => setPickerOpen(false)}
        onChange={date => {
          onChangeText(formatDateOnly(date));
        }}
      />
    </View>
  );
}

function TimeField({
  styles,
  label,
  value,
  onChangeText,
  placeholder,
  error,
}: {
  styles: Styles;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const colors = useThemeColors();
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerValue = useParsedPickerDate(
    value ? `01/01/2000, ${value}` : '',
  );

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.dateInput, error ? styles.inputError : null]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? '12:00'}
          placeholderTextColor={colors.textSoft}
          keyboardType="default"
          style={styles.dateText}
        />
        <Pressable
          onPress={() => setPickerOpen(true)}
          hitSlop={8}
          accessibilityLabel="Open time picker">
          <Icon name="shiftClock" size={11} color={colors.textSoft} />
        </Pressable>
      </View>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
      <AppDatePicker
        visible={pickerOpen}
        value={pickerValue}
        mode="time"
        title="Select Time"
        onClose={() => setPickerOpen(false)}
        onChange={date => {
          const hours = date.getHours();
          const minutes = String(date.getMinutes()).padStart(2, '0');
          onChangeText(`${hours}:${minutes}`);
        }}
      />
    </View>
  );
}

export function NewRental() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    userName,
    dateLabel,
    summary,
    currentStep,
    steps,
    stepCopy,
    form,
    vehicleOptions,
    selectedVehicleId,
    selectedVehicle,
    addons,
    selectedAddonIds,
    promos,
    appliedPromo,
    paymentMethods,
    selectedPaymentMethodId,
    terms,
    termsAccepted,
    existingCustomerName,
    totals,
    submitting,
    setField,
    fieldErrors,
    onSelectExistingCustomer,
    onSelectVehicle,
    onToggleAddon,
    onApplyPromo,
    onSelectPaymentMethod,
    onToggleTerms,
    onNextPress,
    onPreviousPress,
  } = useNewRentalController();

  const footer = (
    <View style={[styles.footerRow, currentStep === 0 && styles.footerRowEnd]}>
      {currentStep > 0 ? (
        <Pressable style={styles.backBtn} onPress={onPreviousPress}>
          <Icon name="arrowLeft" size={10} color={colors.textDark} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      ) : null}
      <Pressable
        style={styles.primaryBtn}
        onPress={onNextPress}
        disabled={submitting}>
        {submitting ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <>
            <Text style={styles.primaryBtnText}>{stepCopy.nextLabel}</Text>
            <Icon name="arrowRight" size={10} color={colors.white} />
          </>
        )}
      </Pressable>
    </View>
  );

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={28}
        keyboardOpeningTime={0}
        enableAutomaticScroll>
        <AppHeader dateLabel={dateLabel} userName={userName} />

        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>New Rental</Text>
            <Text style={styles.pageSubtitle}>{summary}</Text>
          </View>

          <View style={styles.stepperCard}>
            <View style={styles.stepperRow}>
              {steps.map(step => {
                const active = step.id === currentStep;
                return (
                  <View key={step.id} style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        active && styles.stepCircleActive,
                      ]}>
                      <Icon
                        name={step.icon}
                        size={13}
                        color={active ? colors.white : colors.textSoft}
                      />
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        active && styles.stepLabelActive,
                      ]}
                      numberOfLines={1}>
                      {step.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <View>
              <Text style={styles.stepEyebrow}>{stepCopy.eyebrow}</Text>
              <Text style={styles.stepTitle}>{stepCopy.title}</Text>
            </View>

            {currentStep === 0 ? (
              <View style={styles.stack}>
                <Pressable
                  style={styles.customerBox}
                  onPress={onSelectExistingCustomer}>
                  <View style={styles.customerAvatar}>
                    <Icon
                      name="settingsProfile"
                      size={15}
                      color={colors.white}
                    />
                  </View>
                  <View style={styles.customerCopy}>
                    <Text style={styles.customerHint}>
                      Existing customer detected
                    </Text>
                    <Text style={styles.customerName}>
                      {existingCustomerName ?? 'New customer'}
                    </Text>
                  </View>
                </Pressable>

                <View style={styles.row}>
                  <View style={styles.col}>
                    <Field
                      styles={styles}
                      label="Full name"
                      value={form.customerName}
                      onChangeText={text => setField('customerName', text)}
                      placeholder="Ayesha Khan"
                      error={fieldErrors.customerName}
                    />
                  </View>
                  <View style={styles.col}>
                    <Field
                      styles={styles}
                      label="Email"
                      value={form.email}
                      onChangeText={text => setField('email', text)}
                      placeholder="ayesha.khan@example.com"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.col}>
                    <Field
                      styles={styles}
                      label="Phone"
                      value={form.phone}
                      onChangeText={text => setField('phone', text)}
                      placeholder="+92 300 1234567"
                      keyboardType="phone-pad"
                      error={fieldErrors.phone}
                    />
                  </View>
                  <View style={styles.col}>
                    <Field
                      styles={styles}
                      label="Driver's license"
                      value={form.license}
                      onChangeText={text => setField('license', text)}
                      placeholder="LHR-2024-889201"
                    />
                  </View>
                </View>

                <Field
                  styles={styles}
                  label="Address"
                  value={form.address}
                  onChangeText={text => setField('address', text)}
                  placeholder="House 12, DHA Phase 5, Lahore"
                />
              </View>
            ) : null}

            {currentStep === 1 ? (
              <View style={styles.stack}>
                {fieldErrors.vehicle ? (
                  <Text style={styles.fieldError}>{fieldErrors.vehicle}</Text>
                ) : null}
                {vehicleOptions.map(option => {
                  const selected = option.id === selectedVehicleId;
                  return (
                    <Pressable
                      key={option.id}
                      style={[
                        styles.vehicleCard,
                        selected && styles.vehicleCardSelected,
                      ]}
                      onPress={() => onSelectVehicle(option.id)}>
                      <View style={styles.vehicleTop}>
                        <View style={styles.vehicleIcon}>
                          <Icon
                            name="vehicles"
                            size={14}
                            color={colors.actionBlue}
                          />
                        </View>
                        <View style={styles.vehiclePriceBox}>
                          <Text style={styles.vehiclePriceLabel}>per day</Text>
                          <Text style={styles.vehiclePrice}>
                            {option.dailyRateLabel}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.vehicleSegment}>
                          {option.segment}
                        </Text>
                        <Text style={styles.vehicleTitle}>{option.title}</Text>
                      </View>
                      <View style={styles.chipRow}>
                        {option.specs.map(spec => (
                          <View key={spec.label} style={styles.chip}>
                            <Icon
                              name={spec.icon}
                              size={8}
                              color={colors.textSoft}
                            />
                            <Text style={styles.chipText}>{spec.label}</Text>
                          </View>
                        ))}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            {currentStep === 2 ? (
              <View style={styles.stack}>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <DateField
                      styles={styles}
                      label="Pickup date"
                      value={form.pickupDate}
                      onChangeText={text => setField('pickupDate', text)}
                      error={fieldErrors.pickupDate}
                    />
                  </View>
                  <View style={styles.col}>
                    <TimeField
                      styles={styles}
                      label="Pickup time"
                      value={form.pickupTime}
                      onChangeText={text => setField('pickupTime', text)}
                      placeholder="12:00"
                      error={fieldErrors.pickupTime}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.col}>
                    <DateField
                      styles={styles}
                      label="Return date"
                      value={form.returnDate}
                      onChangeText={text => setField('returnDate', text)}
                      error={fieldErrors.returnDate}
                    />
                  </View>
                  <View style={styles.col}>
                    <TimeField
                      styles={styles}
                      label="Return time"
                      value={form.returnTime}
                      onChangeText={text => setField('returnTime', text)}
                      placeholder="17:00"
                      error={fieldErrors.returnTime}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.col}>
                    <Field
                      styles={styles}
                      label="Pickup location"
                      value={form.pickupLocation}
                      onChangeText={text => setField('pickupLocation', text)}
                    />
                  </View>
                  <View style={styles.col}>
                    <Field
                      styles={styles}
                      label="Drop-off location"
                      value={form.dropoffLocation}
                      onChangeText={text => setField('dropoffLocation', text)}
                    />
                  </View>
                </View>

                <Text style={styles.sectionLabel}>Add-ons</Text>
                <View style={styles.addonGrid}>
                  {addons.map(addon => {
                    const selected = selectedAddonIds.includes(addon.id);
                    return (
                      <Pressable
                        key={addon.id}
                        style={[
                          styles.addonTile,
                          selected && styles.addonTileSelected,
                        ]}
                        onPress={() => onToggleAddon(addon.id)}>
                        <View
                          style={[
                            styles.checkbox,
                            selected && styles.checkboxChecked,
                          ]}>
                          {selected ? (
                            <Icon
                              name="checkWhite"
                              size={9}
                              color={colors.white}
                            />
                          ) : null}
                        </View>
                        <Text style={styles.addonText} numberOfLines={1}>
                          {addon.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {currentStep === 3 ? (
              <View style={styles.stack}>
                <View style={styles.promoBox}>
                  <Text style={styles.promoLabel}>Promo code</Text>
                  <TextInput
                    value={form.promoCode}
                    onChangeText={onApplyPromo}
                    placeholder="e.g. WELCOME10"
                    placeholderTextColor={colors.textSoft}
                    autoCapitalize="characters"
                    style={styles.input}
                  />
                  <View style={styles.promoChipRow}>
                    {promos.map(promo => {
                      const active = appliedPromo?.code === promo.code;
                      return (
                        <Pressable
                          key={promo.code}
                          style={[
                            styles.promoChip,
                            active && styles.promoChipActive,
                          ]}
                          onPress={() => onApplyPromo(promo.code)}>
                          <Icon
                            name="promoTag"
                            size={8}
                            color={colors.actionBlue}
                          />
                          <Text style={styles.promoChipText}>
                            {promo.code} · {promo.percent}%
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Base rate × {totals.days} days
                  </Text>
                  <Text style={styles.priceValue}>{totals.baseLabel}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Add-ons</Text>
                  <Text style={styles.priceValue}>{totals.addonsLabel}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Insurance</Text>
                  <Text style={styles.priceValue}>{totals.insuranceLabel}</Text>
                </View>
                {totals.hasDiscount ? (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>
                      Discount ({appliedPromo?.code})
                    </Text>
                    <Text style={styles.priceValue}>
                      {totals.discountLabel}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Subtotal</Text>
                  <Text style={[styles.priceValue, styles.priceStrong]}>
                    {totals.subtotalLabel}
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Tax (18%)</Text>
                  <Text style={styles.priceValue}>{totals.taxLabel}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total due</Text>
                  <Text style={styles.totalValue}>{totals.totalLabel}</Text>
                </View>
              </View>
            ) : null}

            {currentStep === 4 ? (
              <View style={styles.stack}>
                <View style={styles.payMethodRow}>
                  {paymentMethods.map(method => {
                    const selected = method.id === selectedPaymentMethodId;
                    return (
                      <Pressable
                        key={method.id}
                        style={[
                          styles.payMethod,
                          selected && styles.payMethodSelected,
                        ]}
                        onPress={() => onSelectPaymentMethod(method.id)}>
                        <Icon
                          name={method.icon}
                          size={14}
                          color={selected ? colors.actionBlue : colors.textSoft}
                        />
                        <Text style={styles.payMethodLabel}>
                          {method.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {selectedPaymentMethodId === 'card' ? (
                  <>
                    <Field
                      styles={styles}
                      label="Cardholder name"
                      value={form.cardholder}
                      onChangeText={text => setField('cardholder', text)}
                      placeholder="Ayesha Khan"
                      error={fieldErrors.cardholder}
                    />
                    <Field
                      styles={styles}
                      label="Card number"
                      value={form.cardNumber}
                      onChangeText={text => setField('cardNumber', text)}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="number-pad"
                      error={fieldErrors.cardNumber}
                    />
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Field
                          styles={styles}
                          label="Expiry"
                          value={form.expiry}
                          onChangeText={text => setField('expiry', text)}
                          placeholder="MM/YY"
                          error={fieldErrors.expiry}
                        />
                      </View>
                      <View style={styles.col}>
                        <Field
                          styles={styles}
                          label="CVV"
                          value={form.cvv}
                          onChangeText={text => setField('cvv', text)}
                          placeholder="•••"
                          keyboardType="number-pad"
                          secureTextEntry
                          error={fieldErrors.cvv}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <Text style={{fontSize: 9.5, color: colors.textSoft}}>
                    Card details will be shown only for Credit card.
                  </Text>
                )}
              </View>
            ) : null}

            {currentStep === 5 ? (
              <View style={styles.stack}>
                <View style={styles.termsBox}>
                  {terms.map(term => (
                    <View key={term.title}>
                      <Text style={styles.termTitle}>{term.title}</Text>
                      <Text style={styles.termBody}>{term.body}</Text>
                    </View>
                  ))}
                </View>

                <Pressable style={styles.agreeRow} onPress={onToggleTerms}>
                  <View
                    style={[
                      styles.checkbox,
                      termsAccepted && styles.checkboxChecked,
                      fieldErrors.terms ? styles.checkboxError : null,
                    ]}>
                    {termsAccepted ? (
                      <Icon name="checkWhite" size={9} color={colors.white} />
                    ) : null}
                  </View>
                  <Text style={styles.agreeText}>
                    I have read and agree to the DriveHub ERP rental terms,
                    insurance conditions and the total charge shown in the
                    summary.
                  </Text>
                </Pressable>
                {fieldErrors.terms ? (
                  <Text style={styles.fieldError}>{fieldErrors.terms}</Text>
                ) : null}

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>
                    Signature (type full name)
                  </Text>
                  <TextInput
                    value={form.signature}
                    onChangeText={text => setField('signature', text)}
                    placeholder="Ayesha Khan"
                    placeholderTextColor={colors.textSoft}
                    style={[
                      styles.signatureInput,
                      fieldErrors.signature ? styles.inputError : null,
                    ]}
                  />
                  {fieldErrors.signature ? (
                    <Text style={styles.fieldError}>{fieldErrors.signature}</Text>
                  ) : null}
                </View>
              </View>
            ) : null}

            {footer}
          </View>

          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryEyebrow}>Live estimate</Text>
              <Text style={styles.summaryTitle}>Rental Summary</Text>
            </View>

            <View style={styles.summaryHero}>
              <View style={styles.summaryHeroBlock}>
                <Text style={styles.summaryHeroLabel}>Customer</Text>
                <Text style={styles.summaryHeroValue}>
                  {form.customerName.trim() || existingCustomerName || '—'}
                </Text>
              </View>
              <View style={styles.summaryHeroBlock}>
                <Text style={styles.summaryHeroLabel}>Vehicle</Text>
                <Text style={styles.summaryHeroValue}>
                  {selectedVehicle?.title ?? '—'}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Base ({totals.days} days)</Text>
              <Text style={styles.summaryValue}>{totals.baseLabel}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Add-ons</Text>
              <Text style={styles.summaryValue}>{totals.addonsLabel}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Insurance</Text>
              <Text style={styles.summaryValue}>{totals.insuranceLabel}</Text>
            </View>
            {totals.hasDiscount ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.summaryValue}>{totals.discountLabel}</Text>
              </View>
            ) : null}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (18%)</Text>
              <Text style={styles.summaryValue}>{totals.taxLabel}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>{totals.totalLabel}</Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
