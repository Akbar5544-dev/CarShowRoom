import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Icon, Screen} from '../../../components';
import {useThemedStyles} from '../../../theme';
import {FEED_MUTED, FEED_PRIMARY} from './module';
import {createStyles} from './styles';
import {useEditProfileController} from './useController';

export function CustomerEditProfile() {
  const styles = useThemedStyles(createStyles);
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    city,
    address,
    profileSource,
    backgroundSource,
    backgroundTint,
    backgroundThumbs,
    selectedBgId,
    setFirstName,
    setLastName,
    setPhone,
    setEmail,
    setPassword,
    setCity,
    setAddress,
    onBack,
    onSave,
    onChangeProfilePhoto,
    onChangeBackground,
    onSelectBackground,
    onUseCurrentLocation,
  } = useEditProfileController();

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topbar}>
        <Pressable
          style={styles.backBtn}
          accessibilityLabel="Back"
          onPress={onBack}>
          <Icon name="chevronLeft" size={16} color="#111827" />
        </Pressable>
        <Text style={styles.title}>Edit Profile</Text>
        <Pressable style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.photoBlock}>
          <View style={styles.photoWrap}>
            {profileSource ? (
              <Image source={profileSource} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]}>
                <Text style={styles.photoPlaceholderText}>Profile photo</Text>
              </View>
            )}
            <Pressable
              style={styles.cameraBtn}
              accessibilityLabel="Change photo"
              onPress={onChangeProfilePhoto}>
              <Icon name="cameraOutline" size={14} color="#fff" />
            </Pressable>
          </View>
          <Pressable onPress={onChangeProfilePhoto} hitSlop={8}>
            <Text style={styles.changePhoto}>Change profile photo</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Background image</Text>
          <View style={[styles.card, styles.bgCard]}>
            <View style={[styles.bgPreview, {backgroundColor: backgroundTint}]}>
              {backgroundSource ? (
                <Image
                  source={backgroundSource}
                  style={styles.bgPreviewImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.bgPreviewPlaceholder}>
                  <Text style={styles.bgPreviewPlaceholderText}>
                    Background preview
                  </Text>
                </View>
              )}
              <Pressable style={styles.bgChange} onPress={onChangeBackground}>
                <Icon name="cameraOutline" size={12} color="#111827" />
                <Text style={styles.bgChangeText}>Change</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbsRow}>
              {backgroundThumbs.map(thumb => {
                const on = selectedBgId === thumb.id;
                return (
                  <Pressable
                    key={thumb.id}
                    style={[styles.thumb, on && styles.thumbOn]}
                    onPress={() => onSelectBackground(thumb.id)}>
                    {thumb.source ? (
                      <Image
                        source={thumb.source}
                        style={styles.thumbImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.thumbImage,
                          {backgroundColor: thumb.tint},
                        ]}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Personal info</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.field, styles.fieldHalf, styles.fieldHalfLeft]}>
                <Text style={styles.label}>First name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor={FEED_MUTED}
                />
              </View>
              <View style={[styles.field, styles.fieldHalf]}>
                <Text style={styles.label}>Last name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor={FEED_MUTED}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Phone number"
                placeholderTextColor={FEED_MUTED}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor={FEED_MUTED}
              />
            </View>

            <View style={[styles.field, styles.fieldLast]}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor={FEED_MUTED}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location & address</Text>
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>City / Location</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City / Location"
                placeholderTextColor={FEED_MUTED}
              />
            </View>
            <View style={[styles.field, styles.fieldLast]}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={address}
                onChangeText={setAddress}
                multiline
                placeholder="Address"
                placeholderTextColor={FEED_MUTED}
              />
            </View>
          </View>

          <Pressable style={styles.locBtn} onPress={onUseCurrentLocation}>
            <Icon name="mapPin" size={16} color={FEED_PRIMARY} />
            <Text style={styles.locBtnText}>Use current location</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
