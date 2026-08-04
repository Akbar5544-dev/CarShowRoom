import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  DocumentUploadGrid,
  FormDateField,
  FormField,
  FormRow,
  FormSelect,
  GENDER_OPTIONS,
  EMPLOYEE_ROLE_OPTIONS,
  DEPARTMENT_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  BASIC_SALARY_OPTIONS,
  Icon,
  Screen,
  VehicleWizardStepper,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useAddEmployeeController} from './useController';

export function AddEmployee() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    currentStep,
    steps,
    form,
    photoUri,
    documentUploads,
    canGoPrevious,
    isLastStep,
    submitting,
    setField,
    fieldErrors,
    onNextPress,
    onPreviousPress,
    onBackPress,
    onStepPress,
    onUploadPhotoPress,
    onDocumentUploadPress,
  } = useAddEmployeeController();

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
                <Text style={styles.pageTitle}>Add Employee</Text>
                <Text style={styles.pageSubtitle}>
                  Onboard a new team member — 4 quick steps
                </Text>
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
              {currentStep === 0 ? (
                <View style={styles.stepBody}>
                  <View style={styles.photoRow}>
                    <Pressable
                      style={styles.photoBox}
                      onPress={onUploadPhotoPress}
                      accessibilityLabel="Upload profile photo">
                      {photoUri ? (
                        <Image
                          source={{uri: photoUri}}
                          style={styles.photoImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Icon name="camera" size={20} />
                      )}
                    </Pressable>
                    <View style={styles.photoCopy}>
                      <Text style={styles.photoTitle}>Profile Photo</Text>
                      <Text style={styles.photoHint}>
                        Upload a clear headshot · PNG or JPG (max 2 MB)
                      </Text>
                      <Pressable
                        style={styles.uploadBtn}
                        onPress={onUploadPhotoPress}>
                        <Icon name="uploadArrow" size={12} />
                        <Text style={styles.uploadBtnText}>
                          {photoUri ? 'Change Photo' : 'Upload Photo'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.fieldsStack}>
                    <FormRow>
                      <FormField
                        label="Employee Code"
                        value={form.employeeCode}
                        onChangeText={text => setField('employeeCode', text)}
                        placeholder="EMP-056"
                      />
                      <FormField
                        label="National ID"
                        value={form.nationalId}
                        onChangeText={text => setField('nationalId', text)}
                        placeholder="35202-XXXXXXX-X"
                      />
                    </FormRow>
                    <FormRow>
                      <FormField
                        label="First Name"
                        value={form.firstName}
                        onChangeText={text => setField('firstName', text)}
                        placeholder="Ahsan"
                        error={fieldErrors.firstName}
                      />
                      <FormField
                        label="Last Name"
                        value={form.lastName}
                        onChangeText={text => setField('lastName', text)}
                        placeholder="Malik"
                      />
                    </FormRow>
                    <FormRow>
                      <FormSelect
                        label="Gender"
                        value={form.gender}
                        options={GENDER_OPTIONS}
                        placeholder="Select"
                        onChange={value => setField('gender', value)}
                      />
                      <FormDateField
                        label="Date of Birth"
                        value={form.dateOfBirth}
                        onChangeText={text => setField('dateOfBirth', text)}
                      />
                    </FormRow>
                    <FormRow>
                      <FormField
                        label="Phone"
                        value={form.phone}
                        onChangeText={text => setField('phone', text)}
                        placeholder="+92 300 000-0000"
                        keyboardType="phone-pad"
                      />
                      <FormField
                        label="Email"
                        value={form.email}
                        onChangeText={text => setField('email', text)}
                        placeholder="ahsan@drivehub.co"
                        keyboardType="email-address"
                      />
                    </FormRow>
                    <FormRow>
                      <FormField
                        label="City"
                        value={form.city}
                        onChangeText={text => setField('city', text)}
                        placeholder="Karachi"
                      />
                      <FormField
                        label="Emergency Contact"
                        value={form.emergencyContact}
                        onChangeText={text =>
                          setField('emergencyContact', text)
                        }
                        placeholder="Contact"
                      />
                    </FormRow>
                    <FormField
                      label="Address"
                      value={form.address}
                      onChangeText={text => setField('address', text)}
                      placeholder="Street, area, city, postal code"
                      multiline
                      fullWidth
                    />
                  </View>

                  <View style={styles.loginCard}>
                    <View style={styles.loginHeader}>
                      <View style={styles.loginCopy}>
                        <Text style={styles.loginTitle}>Create Login</Text>
                        <Text style={styles.loginHint}>
                          Allow this employee to sign in to the ERP.
                        </Text>
                      </View>
                      <Switch
                        value={form.createLogin}
                        onValueChange={value => setField('createLogin', value)}
                        trackColor={{
                          false: colors.border,
                          true: colors.actionBlue,
                        }}
                        thumbColor={colors.white}
                      />
                    </View>
                    {form.createLogin ? (
                      <FormRow>
                        <FormSelect
                          label="Role"
                          value={form.role}
                          options={EMPLOYEE_ROLE_OPTIONS}
                          placeholder="Select"
                          onChange={value => setField('role', value)}
                          error={fieldErrors.role}
                        />
                        <FormField
                          label="Password"
                          value={form.password}
                          onChangeText={text => setField('password', text)}
                          placeholder="Password"
                          secureTextEntry
                          error={fieldErrors.password}
                        />
                      </FormRow>
                    ) : null}
                  </View>
                </View>
              ) : null}

              {currentStep === 1 ? (
                <View style={styles.stepBody}>
                  <View style={styles.fieldsStack}>
                    <FormRow>
                      <FormField
                        label="Designation"
                        value={form.designation}
                        onChangeText={text => setField('designation', text)}
                        placeholder="Designation"
                      />
                      <FormSelect
                        label="Department"
                        value={form.department}
                        options={DEPARTMENT_OPTIONS}
                        placeholder="Select"
                        onChange={value => setField('department', value)}
                      />
                    </FormRow>
                    <FormRow>
                      <FormDateField
                        label="Joining Date"
                        value={form.joiningDate}
                        onChangeText={text => setField('joiningDate', text)}
                      />
                      <FormSelect
                        label="Employment Type"
                        value={form.employmentType}
                        options={EMPLOYMENT_TYPE_OPTIONS}
                        placeholder="Select"
                        onChange={value => setField('employmentType', value)}
                      />
                    </FormRow>
                    <FormRow>
                      <FormSelect
                        label="Basic Salary"
                        value={form.basicSalary}
                        options={BASIC_SALARY_OPTIONS}
                        placeholder="Select"
                        onChange={value => setField('basicSalary', value)}
                      />
                      <FormField
                        label="Allowances"
                        value={form.allowances}
                        onChangeText={text => setField('allowances', text)}
                        placeholder="Allowances"
                      />
                    </FormRow>
                    <FormSelect
                      label="Status"
                      value={form.employmentStatus}
                      options={EMPLOYMENT_STATUS_OPTIONS}
                      placeholder="Select"
                      onChange={value => setField('employmentStatus', value)}
                      fullWidth
                    />
                  </View>
                </View>
              ) : null}

              {currentStep === 2 ? (
                <View style={styles.stepBody}>
                  <Text style={styles.stepHint}>
                    Enter payroll bank account details.
                  </Text>
                  <View style={styles.fieldsStack}>
                    <FormRow>
                      <FormField
                        label="Bank Name"
                        value={form.bankName}
                        onChangeText={text => setField('bankName', text)}
                        placeholder="HBL"
                      />
                      <FormField
                        label="Account Title"
                        value={form.accountTitle}
                        onChangeText={text => setField('accountTitle', text)}
                        placeholder="Ahsan Malik"
                      />
                    </FormRow>
                    <FormRow>
                      <FormField
                        label="Account Number"
                        value={form.accountNumber}
                        onChangeText={text => setField('accountNumber', text)}
                        placeholder="0000000000"
                        keyboardType="number-pad"
                      />
                      <FormField
                        label="IBAN"
                        value={form.iban}
                        onChangeText={text => setField('iban', text)}
                        placeholder="PK00XXXX0000000000"
                      />
                    </FormRow>
                  </View>
                </View>
              ) : null}

              {currentStep === 3 ? (
                <View style={styles.stepBody}>
                  <DocumentUploadGrid
                    items={documentUploads}
                    onPress={onDocumentUploadPress}
                  />
                </View>
              ) : null}
            </View>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.prevBtn,
                  !canGoPrevious && styles.prevBtnDisabled,
                ]}
                onPress={onPreviousPress}
                disabled={!canGoPrevious}>
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
                  <Text style={styles.nextBtnText}>
                    {isLastStep ? 'Submit' : 'Next'}
                  </Text>
                )}
                {!submitting && !isLastStep ? (
                  <Icon name="arrowRight" size={12} />
                ) : null}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
