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
import {Images} from '../../../assets';
import {
  FormDateField,
  FormField,
  FormSelect,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  Icon,
  Screen,
} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {EditVehicleSectionId} from './module';
import {createStyles} from './styles';
import {useEditVehicleController} from './useController';

function FormTripleRow({children}: {children: React.ReactNode}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.tripleRow}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={styles.tripleChild}>
          {child}
        </View>
      ))}
    </View>
  );
}

function SectionCard({
  id,
  title,
  subtitle,
  onLayout,
  children,
}: {
  id: EditVehicleSectionId;
  title: string;
  subtitle: string;
  onLayout: (id: EditVehicleSectionId, y: number) => void;
  children: React.ReactNode;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={styles.sectionCard}
      onLayout={event => onLayout(id, event.nativeEvent.layout.y)}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      {children}
    </View>
  );
}

export function EditVehicle() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    plateNo,
    vehicleTitle,
    subtitle,
    imageUri,
    imageTint,
    availableForRent,
    quickNav,
    activeSection,
    form,
    photoUris,
    loading,
    saving,
    setField,
    setAvailableForRent,
    onBackToInventoryPress,
    onCancelPress,
    onSavePress,
    onQuickNavPress,
    onAddPhotoPress,
    registerSectionOffset,
    setScrollRef,
  } = useEditVehicleController();

  const imageSource = imageUri ? {uri: imageUri} : Images.fleetVehicle;

  if (loading) {
    return (
      <Screen style={styles.container}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={colors.actionBlue} />
        </View>
      </Screen>
    );
  }

  const handleSectionLayout = (id: EditVehicleSectionId, y: number) => {
    registerSectionOffset(id, y);
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        innerRef={ref => setScrollRef(ref)}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={28}
        keyboardOpeningTime={0}
        enableAutomaticScroll>
        <View style={styles.main}>
          <View style={styles.topBar}>
            <Pressable style={styles.backBtn} onPress={onCancelPress} hitSlop={8}>
              <Icon name="arrowLeft" size={12} color={colors.white} />
            </Pressable>
            <Text style={styles.topTitle}>Car Details</Text>
            <View style={styles.topActions}>
              <Pressable style={styles.topIconBtn} hitSlop={6}>
                <Icon name="search" size={14} />
              </Pressable>
              <Pressable style={styles.topIconBtn} hitSlop={6}>
                <Icon name="bell" size={14} />
                <View style={styles.notifyDot} />
              </Pressable>
              <Pressable style={styles.topIconBtn} hitSlop={6}>
                <Icon name="settings" size={14} />
              </Pressable>
            </View>
          </View>

          <Pressable onPress={onBackToInventoryPress}>
            <Text style={styles.breadcrumb}>← Back to inventory • {plateNo}</Text>
          </Pressable>

          <View style={styles.pageHeaderRow}>
            <View style={styles.pageHeaderCopy}>
              <Text style={styles.pageTitle}>Edit Vehicle</Text>
              <Text style={styles.pageSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.cancelBtn} onPress={onCancelPress}>
                <Icon name="closeCross" size={10} color={colors.textDark} />
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.saveBtn}
                onPress={onSavePress}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Icon name="saveDraft" size={10} color={colors.white} />
                    <Text style={styles.saveText}>Save changes</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.previewCard}>
            <View style={[styles.previewImageWrap, {backgroundColor: imageTint}]}>
              <Image source={imageSource} style={styles.previewImage} resizeMode="contain" />
            </View>
            <View style={styles.previewBody}>
              <Text style={styles.previewMakeYear}>
                {form.brand} • {form.year}
              </Text>
              <Text style={styles.previewTitle}>{vehicleTitle}</Text>
              <View style={styles.toggleRow}>
                <View style={styles.toggleCopy}>
                  <Text style={styles.toggleTitle}>Available for rent</Text>
                  <Text style={styles.toggleSubtitle}>Toggle listing status</Text>
                </View>
                <Switch
                  value={availableForRent}
                  onValueChange={setAvailableForRent}
                  trackColor={{false: colors.track, true: colors.actionBlue}}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          </View>

          <View style={styles.quickNavCard}>
            <View style={styles.quickNavRow}>
              {quickNav.map(item => {
                const active = activeSection === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.quickNavItem, active && styles.quickNavItemActive]}
                    onPress={() => onQuickNavPress(item.id)}>
                    <Icon
                      name={item.icon}
                      size={13}
                      color={active ? colors.actionBlue : colors.textSoft}
                    />
                    <Text
                      style={[
                        styles.quickNavLabel,
                        active && styles.quickNavLabelActive,
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <SectionCard
            id="basic"
            title="Basic Information"
            subtitle="Core identity of the vehicle."
            onLayout={handleSectionLayout}>
            <FormTripleRow>
              <FormField
                label="Brand"
                value={form.brand}
                onChangeText={text => setField('brand', text)}
              />
              <FormField
                label="Model"
                value={form.model}
                onChangeText={text => setField('model', text)}
              />
              <FormField
                label="Variant"
                value={form.variant}
                onChangeText={text => setField('variant', text)}
              />
            </FormTripleRow>
            <FormTripleRow>
              <FormField
                label="Year"
                value={form.year}
                onChangeText={text => setField('year', text)}
                keyboardType="number-pad"
              />
              <FormField
                label="Registration"
                value={form.registration}
                onChangeText={text => setField('registration', text)}
              />
              <FormField
                label="VIN"
                value={form.vin}
                onChangeText={text => setField('vin', text)}
              />
            </FormTripleRow>
            <FormTripleRow>
              <FormSelect
                label="Fuel Type"
                value={form.fuelType}
                options={FUEL_TYPE_OPTIONS}
                placeholder="Select"
                onChange={value => setField('fuelType', value)}
              />
              <FormSelect
                label="Transmission"
                value={form.transmission}
                options={TRANSMISSION_OPTIONS}
                placeholder="Select"
                onChange={value => setField('transmission', value)}
              />
              <FormField
                label="Seats"
                value={form.seats}
                onChangeText={text => setField('seats', text)}
                keyboardType="number-pad"
              />
            </FormTripleRow>
            <FormTripleRow>
              <FormField
                label="Color"
                value={form.color}
                onChangeText={text => setField('color', text)}
              />
              <FormField
                label="Mileage (KM)"
                value={form.mileage}
                onChangeText={text => setField('mileage', text)}
                keyboardType="number-pad"
              />
              <FormSelect
                label="Category"
                value={form.category}
                options={[
                  'Executive',
                  'Luxury',
                  'SUV',
                  'Sedan',
                  'Sports',
                  'Electric',
                ]}
                placeholder="Select"
                onChange={value => setField('category', value)}
              />
            </FormTripleRow>
            <FormField
              label="Description"
              value={form.description}
              onChangeText={text => setField('description', text)}
              multiline
              fullWidth
            />
          </SectionCard>

          <SectionCard
            id="pricing"
            title="Pricing"
            subtitle="Daily, weekly and monthly rental rates."
            onLayout={handleSectionLayout}>
            <FormTripleRow>
              <FormField
                label="Daily Rate ($)"
                value={form.dailyRate}
                onChangeText={text => setField('dailyRate', text)}
                keyboardType="decimal-pad"
              />
              <FormField
                label="Weekly Rate ($)"
                value={form.weeklyRate}
                onChangeText={text => setField('weeklyRate', text)}
                keyboardType="decimal-pad"
              />
              <FormField
                label="Monthly Rate ($)"
                value={form.monthlyRate}
                onChangeText={text => setField('monthlyRate', text)}
                keyboardType="decimal-pad"
              />
            </FormTripleRow>
            <FormTripleRow>
              <FormField
                label="Security Deposit"
                value={form.securityDeposit}
                onChangeText={text => setField('securityDeposit', text)}
                keyboardType="decimal-pad"
              />
              <FormField
                label="Overage per KM ($)"
                value={form.overagePerKm}
                onChangeText={text => setField('overagePerKm', text)}
                keyboardType="decimal-pad"
              />
              <FormField
                label="Free KM / Day"
                value={form.freeKmPerDay}
                onChangeText={text => setField('freeKmPerDay', text)}
                keyboardType="number-pad"
              />
            </FormTripleRow>
          </SectionCard>

          <SectionCard
            id="insurance"
            title="Insurance & Documents"
            subtitle="Compliance and legal coverage."
            onLayout={handleSectionLayout}>
            <FormTripleRow>
              <FormField
                label="Insurance Provider"
                value={form.insuranceProvider}
                onChangeText={text => setField('insuranceProvider', text)}
              />
              <FormField
                label="Policy Number"
                value={form.policyNumber}
                onChangeText={text => setField('policyNumber', text)}
              />
              <FormDateField
                label="Valid From"
                value={form.validFrom}
                onChangeText={text => setField('validFrom', text)}
              />
            </FormTripleRow>
            <FormTripleRow>
              <FormDateField
                label="Valid Until"
                value={form.validUntil}
                onChangeText={text => setField('validUntil', text)}
              />
              <FormDateField
                label="Registration Expiry"
                value={form.registrationExpiry}
                onChangeText={text => setField('registrationExpiry', text)}
              />
              <FormDateField
                label="Fitness Certificate"
                value={form.fitnessCertificate}
                onChangeText={text => setField('fitnessCertificate', text)}
              />
            </FormTripleRow>
          </SectionCard>

          <SectionCard
            id="media"
            title="Photos & Media"
            subtitle="Upload up to 12 high-resolution images."
            onLayout={handleSectionLayout}>
            <View style={styles.mediaGrid}>
              <Pressable style={styles.mediaAdd} onPress={onAddPhotoPress}>
                <Icon name="uploadArrow" size={14} color={colors.actionBlue} />
                <Text style={styles.mediaAddText}>Add photo</Text>
              </Pressable>
              {photoUris.map((uri, index) => (
                <View key={`photo-${uri}-${index}`} style={styles.mediaThumb}>
                  <Image
                    source={{uri}}
                    style={styles.mediaImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </View>
          </SectionCard>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
