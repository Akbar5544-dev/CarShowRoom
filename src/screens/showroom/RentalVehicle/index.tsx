import React from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Icon,
  RentalVehicleSummaryCard,
  RentalWizardStepper,
  Screen,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useRentalVehicleController} from './useController';

export function RentalVehicle() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    vehicle,
    currentStep,
    steps,
    stepTitle,
    stepDescription,
    filteredCustomers,
    selectedCustomerId,
    addons,
    selectedAddonIds,
    selectedAddons,
    insuranceOptions,
    selectedInsuranceId,
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
    onToggleAddon,
    onSelectInsurance,
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
                STEP {currentStep + 1} OF 3
              </Text>
              <Text style={styles.stepTitle}>{stepTitle}</Text>
              {stepDescription ? (
                <Text style={styles.stepDescription}>{stepDescription}</Text>
              ) : null}

              {currentStep === 0 ? (
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

              {currentStep === 1 ? (
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
                          <Text style={styles.insuranceTitle}>
                            {option.title}
                          </Text>
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

              {currentStep === 2 ? (
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
                    By confirming, you finalize this rental booking for the
                    selected vehicle.
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

          {currentStep === 2 ? (
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
