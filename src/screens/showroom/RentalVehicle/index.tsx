import React from 'react';
import {ActivityIndicator, Pressable, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  FormDateField,
  FormField,
  FormRow,
  Icon,
  RentalVehicleSummaryCard,
  RentalWizardStepper,
  Screen,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {customerTierStyle, useRentalVehicleController} from './useController';

export function RentalVehicle() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    vehicle,
    currentStep,
    steps,
    stepTitle,
    stepDescription,
    form,
    customerSearch,
    filteredCustomers,
    selectedCustomerId,
    addons,
    selectedAddonIds,
    selectedAddons,
    insuranceOptions,
    selectedInsuranceId,
    paymentMethods,
    selectedPaymentMethodId,
    durationDays,
    baseRentalTotal,
    addonsTotal,
    insuranceTotal,
    taxTotal,
    grandTotal,
    reviewFields,
    vehicleYear,
    canGoPrevious,
    isLastStep,
    setCustomerSearch,
    setField,
    onSelectCustomer,
    onToggleAddon,
    onSelectInsurance,
    onSelectPaymentMethod,
    onBackPress,
    onPreviousPress,
    onNextPress,
    submitting,
  } = useRentalVehicleController();

  const selectedCustomer = filteredCustomers.find(
    customer => customer.id === selectedCustomerId,
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
        <View style={styles.main}>
          <Pressable style={styles.backLink} onPress={onBackPress} hitSlop={8}>
            <Icon name="arrowLeft" size={10} color={colors.textSoft} />
            <Text style={styles.backLinkText}>Back to vehicle</Text>
          </Pressable>

          <RentalVehicleSummaryCard vehicle={vehicle} />

          <RentalWizardStepper steps={steps} currentStep={currentStep} />

          <View style={styles.card}>
            <View style={styles.formPanel}>
              <Text style={styles.stepEyebrow}>
                STEP {currentStep + 1} OF 6
              </Text>
              <Text style={styles.stepTitle}>{stepTitle}</Text>
              {stepDescription ? (
                <Text style={styles.stepDescription}>{stepDescription}</Text>
              ) : null}

              {currentStep === 0 ? (
                <View style={styles.customerList}>
                  <View style={styles.search}>
                    <Icon name="search" size={12} />
                    <TextInput
                      value={customerSearch}
                      onChangeText={setCustomerSearch}
                      placeholder="Search name or ID..."
                      placeholderTextColor={colors.textSoft}
                      style={styles.searchInput}
                      returnKeyType="search"
                    />
                  </View>

                  {filteredCustomers.map(customer => {
                    const selected = customer.id === selectedCustomerId;
                    const tier = customerTierStyle(customer.tier);
                    return (
                      <Pressable
                        key={customer.id}
                        style={[
                          styles.customerCard,
                          selected && styles.customerCardSelected,
                        ]}
                        onPress={() => onSelectCustomer(customer.id)}>
                        <View style={styles.customerTop}>
                          <Text style={styles.customerCode}>{customer.code}</Text>
                          <View
                            style={[
                              styles.tierBadge,
                              {backgroundColor: tier.bg},
                            ]}>
                            <Text style={[styles.tierText, {color: tier.color}]}>
                              {customer.tier}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.customerName}>{customer.name}</Text>
                        <Text style={styles.customerMeta} numberOfLines={1}>
                          {customer.phone} · {customer.licenseInfo}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              {currentStep === 1 ? (
                <View style={styles.customerList}>
                  <FormRow>
                    <FormDateField
                      label="Pickup date & time"
                      value={form.pickupDateTime}
                      onChangeText={text => setField('pickupDateTime', text)}
                      placeholder="mm/dd/yyyy, hh:mm AM"
                      includeTime
                    />
                    <FormDateField
                      label="Return date & time"
                      value={form.returnDateTime}
                      onChangeText={text => setField('returnDateTime', text)}
                      placeholder="mm/dd/yyyy, hh:mm AM"
                      includeTime
                    />
                  </FormRow>
                  <FormField
                    label="Pickup location"
                    value={form.pickupLocation}
                    onChangeText={text => setField('pickupLocation', text)}
                    placeholder="Lahore Airport - Terminal 1"
                    fullWidth
                  />
                  <FormField
                    label="Drop-off location"
                    value={form.dropoffLocation}
                    onChangeText={text => setField('dropoffLocation', text)}
                    placeholder="DHA Phase 5 - Branch"
                    fullWidth
                  />
                  <View style={styles.durationBox}>
                    <View>
                      <Text style={styles.durationLabel}>DURATION</Text>
                      <Text style={styles.durationValue}>{durationDays} days</Text>
                    </View>
                    <Text style={styles.durationPrice}>
                      Base rental · {baseRentalTotal}
                    </Text>
                  </View>
                </View>
              ) : null}

              {currentStep === 2 ? (
                <View style={styles.customerList}>
                  {addons.map(addon => {
                    const selected = selectedAddonIds.includes(addon.id);
                    return (
                      <Pressable
                        key={addon.id}
                        style={[
                          styles.addonCard,
                          selected && styles.addonCardSelected,
                        ]}
                        onPress={() => onToggleAddon(addon.id)}>
                        <View style={styles.addonCopy}>
                          <Text style={styles.addonTitle}>{addon.title}</Text>
                          <Text style={styles.addonDescription}>
                            {addon.description}
                          </Text>
                          <Text style={styles.addonPrice}>
                            {addon.dailyRate}/day
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.checkCircle,
                            selected && styles.checkCircleSelected,
                          ]}>
                          {selected ? (
                            <Icon
                              name="activityCheck"
                              size={10}
                              color={colors.white}
                            />
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              {currentStep === 3 ? (
                <View style={styles.customerList}>
                  {insuranceOptions.map(option => {
                    const selected = option.id === selectedInsuranceId;
                    return (
                      <Pressable
                        key={option.id}
                        style={[
                          styles.insuranceCard,
                          selected && styles.insuranceCardSelected,
                        ]}
                        onPress={() => onSelectInsurance(option.id)}>
                        {option.popular ? (
                          <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>POPULAR</Text>
                          </View>
                        ) : null}
                        <View style={styles.insuranceTop}>
                          <View
                            style={[
                              styles.radio,
                              selected && styles.radioSelected,
                            ]}>
                            {selected ? <View style={styles.radioDot} /> : null}
                          </View>
                          <Text style={styles.insuranceTitle}>{option.title}</Text>
                        </View>
                        <Text style={styles.insuranceDescription}>
                          {option.description}
                        </Text>
                        <Text style={styles.insurancePrice}>
                          {option.dailyRate}/day
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              {currentStep === 4 ? (
                <View style={styles.customerList}>
                  {paymentMethods.map(method => {
                    const selected = method.id === selectedPaymentMethodId;
                    return (
                      <Pressable
                        key={method.id}
                        style={[
                          styles.paymentMethodCard,
                          selected && styles.paymentMethodCardSelected,
                        ]}
                        onPress={() => onSelectPaymentMethod(method.id)}>
                        <Icon name={method.icon} size={14} />
                        <Text style={styles.paymentMethodLabel}>
                          {method.label}
                        </Text>
                      </Pressable>
                    );
                  })}

                  {selectedPaymentMethodId === 'card' ? (
                    <View style={styles.paymentFields}>
                      <FormRow>
                        <FormField
                          label="Card number"
                          value={form.cardNumber}
                          onChangeText={text => setField('cardNumber', text)}
                          placeholder="•••• •••• •••• 4242"
                        />
                        <FormField
                          label="Cardholder"
                          value={form.cardholder}
                          onChangeText={text => setField('cardholder', text)}
                          placeholder="Ayesha Khan"
                        />
                      </FormRow>
                      <FormRow>
                        <FormField
                          label="Expiry"
                          value={form.cardExpiry}
                          onChangeText={text => setField('cardExpiry', text)}
                          placeholder="MM / YY"
                        />
                        <FormField
                          label="CVC"
                          value={form.cardCvc}
                          onChangeText={text => setField('cardCvc', text)}
                          placeholder="•••"
                          secureTextEntry
                        />
                      </FormRow>
                      <FormField
                        label="Internal notes"
                        value={form.internalNotes}
                        onChangeText={text => setField('internalNotes', text)}
                        placeholder="Special instructions, ID checks..."
                        multiline
                        fullWidth
                      />
                    </View>
                  ) : null}
                </View>
              ) : null}

              {currentStep === 5 ? (
                <View style={styles.customerList}>
                  <View style={styles.reviewGrid}>
                    {reviewFields.map(field => (
                      <View key={field.label} style={styles.reviewCell}>
                        <Text style={styles.reviewLabel}>{field.label}</Text>
                        <Text style={styles.reviewValue}>{field.value}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.disclaimer}>
                    By confirming, the customer accepts the rental agreement and
                    authorizes a security hold on the selected payment method.
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.prevBtn,
                  !canGoPrevious && currentStep === 0 && styles.prevBtnDisabled,
                ]}
                onPress={onPreviousPress}>
                <Icon name="arrowLeft" size={11} />
                <Text style={styles.prevBtnText}>Previous</Text>
              </Pressable>
              <Pressable
                style={styles.nextBtn}
                onPress={onNextPress}
                disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.nextBtnText}>
                      {isLastStep ? 'Confirm Rental' : 'Continue'}
                    </Text>
                    <Icon
                      name={isLastStep ? 'activityCheck' : 'arrowRight'}
                      size={11}
                      color={colors.white}
                    />
                  </>
                )}
              </Pressable>
            </View>
          </View>

          {currentStep === 5 ? (
            <>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionEyebrow}>Rental Summary</Text>
                <View style={styles.summaryHero}>
                  <View style={styles.summaryHeroRow}>
                    <Text style={styles.summaryHeroLabel}>Customer</Text>
                    <Text style={styles.summaryHeroValue}>
                      {selectedCustomer?.name ?? '—'}
                    </Text>
                  </View>
                  <View style={styles.summaryHeroRow}>
                    <Text style={styles.summaryHeroLabel}>Vehicle</Text>
                    <Text style={styles.summaryHeroValue}>
                      {vehicle.title}
                      {vehicleYear ? ` · ${vehicleYear}` : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Base ({durationDays}d × {vehicle.dailyRate})
                  </Text>
                  <Text style={styles.summaryValue}>{baseRentalTotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Add-ons</Text>
                  <Text style={styles.summaryValue}>{addonsTotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Insurance</Text>
                  <Text style={styles.summaryValue}>{insuranceTotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax (18%)</Text>
                  <Text style={styles.summaryValue}>{taxTotal}</Text>
                </View>
                <View style={styles.totalLine}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{grandTotal}</Text>
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionEyebrow}>Selected Add-ons</Text>
                {selectedAddons.length > 0 ? (
                  selectedAddons.map(addon => (
                    <View key={addon.id} style={styles.selectedAddonRow}>
                      <View style={styles.selectedAddonLeft}>
                        <Icon
                          name="activityCheck"
                          size={11}
                          color={colors.successBright}
                        />
                        <Text style={styles.selectedAddonTitle}>
                          {addon.title}
                        </Text>
                      </View>
                      <Text style={styles.selectedAddonPrice}>
                        {addon.dailyRate}/d
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.disclaimer}>No add-ons selected</Text>
                )}
              </View>
            </>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
