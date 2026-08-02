import React from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  DocumentUploadGrid,
  FormDateField,
  FormField,
  FormRow,
  FormSelect,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  DRIVE_TYPE_OPTIONS,
  VEHICLE_STATUS_OPTIONS,
  OWNERSHIP_OPTIONS,
  BRANCH_OPTIONS,
  Icon,
  Screen,
  VehicleWizardStepper,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useAddVehicleController} from './useController';

export function AddVehicle() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    summary,
    currentStep,
    steps,
    stepTitle,
    stepDescription,
    form,
    canGoPrevious,
    isLastStep,
    submitting,
    reviewFields,
    specSheetName,
    insuranceDocName,
    registrationDocName,
    imageUploads,
    setField,
    onNextPress,
    onPreviousPress,
    onBackPress,
    onStepPress,
    onSpecSheetPress,
    onInsuranceDocPress,
    onRegistrationDocPress,
    onImageUploadPress,
    categoryOptions,
  } = useAddVehicleController();

  const stepNumber = currentStep + 1;

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
          <View style={styles.pageHeader}>
            <View style={styles.titleRow}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={12} color={colors.white} />
              </Pressable>
              <View style={styles.titleCopy}>
                <Text style={styles.pageTitle}>Add Vehicles</Text>
                <Text style={styles.pageSubtitle}>{summary}</Text>
              </View>
            </View>
          </View>

          <VehicleWizardStepper
            steps={steps}
            currentStep={currentStep}
            onStepPress={onStepPress}
          />

          <View style={styles.card}>
            <View style={styles.formPanel}>
              <Text style={styles.stepEyebrow}>
                STEP {stepNumber} OF 6
              </Text>
              <Text style={styles.stepTitle}>{stepTitle}</Text>
              {stepDescription ? (
                <Text style={styles.stepDescription}>{stepDescription}</Text>
              ) : null}

              {currentStep === 0 ? (
                <View style={styles.fieldsStack}>
                  <FormRow>
                    <FormField
                      label="Vehicle Code"
                      value={form.vehicleCode}
                      onChangeText={text => setField('vehicleCode', text)}
                      placeholder="VH-2048"
                    />
                    <FormField
                      label="Registration / Plate"
                      value={form.registrationPlate}
                      onChangeText={text =>
                        setField('registrationPlate', text)
                      }
                      placeholder="DXB-A 72841"
                    />
                  </FormRow>
                  <FormRow>
                    <FormField
                      label="Make"
                      value={form.make}
                      onChangeText={text => setField('make', text)}
                      placeholder="BMW"
                    />
                    <FormField
                      label="Model"
                      value={form.model}
                      onChangeText={text => setField('model', text)}
                      placeholder="i7 xDrive60"
                    />
                  </FormRow>
                  <FormRow>
                    <FormField
                      label="Year"
                      value={form.year}
                      onChangeText={text => setField('year', text)}
                      placeholder="2025"
                      keyboardType="number-pad"
                    />
                    <FormSelect
                      label="Category"
                      value={form.category}
                      options={categoryOptions}
                      placeholder="Select"
                      onChange={value => setField('category', value)}
                    />
                  </FormRow>
                  <FormRow>
                    <FormSelect
                      label="Branch"
                      value={form.branch}
                      options={BRANCH_OPTIONS}
                      placeholder="Select"
                      onChange={value => setField('branch', value)}
                    />
                    <FormSelect
                      label="Status"
                      value={form.status}
                      options={VEHICLE_STATUS_OPTIONS}
                      placeholder="Select"
                      onChange={value => setField('status', value)}
                    />
                  </FormRow>
                  <FormField
                    label="Description"
                    value={form.description}
                    onChangeText={text => setField('description', text)}
                    placeholder="Vehicle notes, trim level, special features..."
                    multiline
                    fullWidth
                  />
                </View>
              ) : null}

              {currentStep === 1 ? (
                <View style={styles.fieldsStack}>
                  <FormRow>
                    <FormField
                      label="Engine Type"
                      value={form.engineType}
                      onChangeText={text => setField('engineType', text)}
                      placeholder="Electric"
                    />
                    <FormField
                      label="Horsepower"
                      value={form.horsepower}
                      onChangeText={text => setField('horsepower', text)}
                      placeholder="536 hp"
                    />
                  </FormRow>
                  <FormRow>
                    <FormSelect
                      label="Transmission"
                      value={form.transmission}
                      options={TRANSMISSION_OPTIONS}
                      placeholder="Select"
                      onChange={value => setField('transmission', value)}
                    />
                    <FormSelect
                      label="Drive Type"
                      value={form.driveType}
                      options={DRIVE_TYPE_OPTIONS}
                      placeholder="Select"
                      onChange={value => setField('driveType', value)}
                    />
                  </FormRow>
                  <FormRow>
                    <FormSelect
                      label="Fuel Type"
                      value={form.fuelType}
                      options={FUEL_TYPE_OPTIONS}
                      placeholder="Select"
                      onChange={value => setField('fuelType', value)}
                    />
                    <FormField
                      label="Battery / Tank"
                      value={form.batteryTank}
                      onChangeText={text => setField('batteryTank', text)}
                      placeholder="101.7 kWh"
                    />
                  </FormRow>
                  <FormRow>
                    <FormField
                      label="Seats"
                      value={form.seats}
                      onChangeText={text => setField('seats', text)}
                      placeholder="5"
                      keyboardType="number-pad"
                    />
                    <FormField
                      label="Doors"
                      value={form.doors}
                      onChangeText={text => setField('doors', text)}
                      placeholder="4"
                      keyboardType="number-pad"
                    />
                  </FormRow>
                  <FormRow>
                    <FormField
                      label="Mileage"
                      value={form.mileage}
                      onChangeText={text => setField('mileage', text)}
                      placeholder="12,400 km"
                    />
                    <FormField
                      label="Color"
                      value={form.color}
                      onChangeText={text => setField('color', text)}
                      placeholder="Mineral White"
                    />
                  </FormRow>
                  <Pressable style={styles.uploadArea} onPress={onSpecSheetPress}>
                    <Icon name="uploadDoc" size={18} color={colors.actionBlue} />
                    <Text style={styles.uploadTitle}>
                      {specSheetName ?? 'Upload spec sheet'}
                    </Text>
                    <Text style={styles.uploadHint}>
                      PDF, PNG, JPG · up to 10 MB
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              {currentStep === 2 ? (
                <View style={styles.fieldsStack}>
                  <FormRow>
                    <FormField
                      label="Daily Rate"
                      value={form.dailyRate}
                      onChangeText={text => setField('dailyRate', text)}
                      placeholder="$420"
                    />
                    <FormField
                      label="Weekly Rate"
                      value={form.weeklyRate}
                      onChangeText={text => setField('weeklyRate', text)}
                      placeholder="$2,520"
                    />
                  </FormRow>
                  <FormRow>
                    <FormField
                      label="Monthly Rate"
                      value={form.monthlyRate}
                      onChangeText={text => setField('monthlyRate', text)}
                      placeholder="$9,800"
                    />
                    <FormField
                      label="Security Deposit"
                      value={form.securityDeposit}
                      onChangeText={text => setField('securityDeposit', text)}
                      placeholder="$1,500"
                    />
                  </FormRow>
                  <FormRow>
                    <FormField
                      label="Extra KM Charge"
                      value={form.extraKmCharge}
                      onChangeText={text => setField('extraKmCharge', text)}
                      placeholder="$0.45"
                    />
                    <FormField
                      label="Late Return Fee"
                      value={form.lateReturnFee}
                      onChangeText={text => setField('lateReturnFee', text)}
                      placeholder="$85"
                    />
                  </FormRow>
                  <View style={styles.tagRow}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>Weekend surge 12%</Text>
                    </View>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>VIP discount enabled</Text>
                    </View>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>Tax inclusive</Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {currentStep === 3 ? (
                <View style={styles.fieldsStack}>
                  <FormRow>
                    <FormField
                      label="Insurance Provider"
                      value={form.insuranceProvider}
                      onChangeText={text =>
                        setField('insuranceProvider', text)
                      }
                      placeholder="AXA Gulf"
                    />
                    <FormField
                      label="Policy Number"
                      value={form.policyNumber}
                      onChangeText={text => setField('policyNumber', text)}
                      placeholder="POL-AXA-99231"
                    />
                  </FormRow>
                  <FormRow>
                    <FormField
                      label="Coverage Type"
                      value={form.coverageType}
                      onChangeText={text => setField('coverageType', text)}
                      placeholder="Comprehensive"
                    />
                    <FormDateField
                      label="Insurance Expiry"
                      value={form.insuranceExpiry}
                      onChangeText={text => setField('insuranceExpiry', text)}
                    />
                  </FormRow>
                  <FormRow>
                    <FormDateField
                      label="Registration Expiry"
                      value={form.registrationExpiry}
                      onChangeText={text =>
                        setField('registrationExpiry', text)
                      }
                    />
                    <FormSelect
                      label="Ownership"
                      value={form.ownership}
                      options={OWNERSHIP_OPTIONS}
                      placeholder="Select"
                      onChange={value => setField('ownership', value)}
                    />
                  </FormRow>
                  <View style={styles.uploadRow}>
                    <Pressable
                      style={[styles.uploadArea, styles.uploadHalf]}
                      onPress={onInsuranceDocPress}>
                      <Icon name="uploadDoc" size={16} color={colors.actionBlue} />
                      <Text style={styles.uploadTitle}>
                        {insuranceDocName ?? 'Upload insurance certificate'}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.uploadArea, styles.uploadHalf]}
                      onPress={onRegistrationDocPress}>
                      <Icon name="uploadDoc" size={16} color={colors.actionBlue} />
                      <Text style={styles.uploadTitle}>
                        {registrationDocName ?? 'Upload registration card'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}

              {currentStep === 4 ? (
                <View style={styles.fieldsStack}>
                  <DocumentUploadGrid
                    items={imageUploads.map(item => ({
                      id: item.id,
                      title: item.title,
                      fileName: item.fileName,
                    }))}
                    onPress={item => onImageUploadPress(item.id)}
                  />
                  <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                      Recommended: upload at least 6 clear photos before making
                      this vehicle available online.
                    </Text>
                  </View>
                </View>
              ) : null}

              {currentStep === 5 ? (
                <View style={styles.fieldsStack}>
                  <View style={styles.reviewGrid}>
                    {reviewFields.map(field => (
                      <View key={field.label} style={styles.reviewCell}>
                        <Text style={styles.reviewLabel}>{field.label}</Text>
                        <Text style={styles.reviewValue}>{field.value}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.readyBox}>
                    <Text style={styles.readyTitle}>Ready to publish</Text>
                    <Text style={styles.readyText}>
                      All required fields are complete. The vehicle can now be
                      added to inventory and availability calendar.
                    </Text>
                  </View>
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
                <Icon name="arrowLeft" size={12} />
                <Text style={styles.prevBtnText}>Previous</Text>
              </Pressable>
              <Pressable
                style={[styles.nextBtn, submitting && styles.prevBtnDisabled]}
                onPress={onNextPress}
                disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.nextBtnText}>
                      {isLastStep ? 'Add Vehicle' : 'Continue'}
                    </Text>
                    <Icon
                      name={isLastStep ? 'activityCheck' : 'arrowRight'}
                      size={12}
                      color={colors.white}
                    />
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
