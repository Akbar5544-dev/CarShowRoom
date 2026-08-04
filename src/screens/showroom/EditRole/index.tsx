import React from 'react';
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useEditRoleController} from './useController';

function GrantIcon({
  allowed,
  onPress,
}: {
  allowed: boolean;
  onPress: () => void;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      style={allowed ? styles.grantYes : styles.grantNo}
      onPress={onPress}
      hitSlop={6}>
      <Text style={allowed ? styles.grantYesText : styles.grantNoText}>
        {allowed ? '✓' : '✕'}
      </Text>
    </Pressable>
  );
}

export function EditRole() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    name,
    description,
    active,
    matrixColumns,
    matrixRows,
    setName,
    setDescription,
    setActive,
    toggleGrant,
    onBackPress,
    onCancelPress,
    onSavePress,
  } = useEditRoleController();

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
                <Icon name="arrowLeft" size={14} color={colors.white} />
              </Pressable>
              <View style={styles.titleBlock}>
                <Text style={styles.pageTitle} numberOfLines={1}>
                  Edit role
                </Text>
                <Text style={styles.pageSubtitle} numberOfLines={2}>
                  Update details and fine-tune permissions per module
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.cancelBtn} onPress={onCancelPress}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={onSavePress}>
                <Icon name="saveDraft" size={12} color={colors.white} />
                <Text style={styles.saveBtnText}>Save changes</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>
                Toggle actions per module
              </Text>
              <Text style={styles.sectionTitle}>Permission matrix</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.matrixScroll}>
              <View style={styles.matrix}>
                <View style={styles.matrixHeaderRow}>
                  <View style={styles.matrixModuleCol}>
                    <Text style={styles.matrixModuleHeader}>Module</Text>
                  </View>
                  {matrixColumns.map(column => (
                    <View key={column.id} style={styles.matrixRoleCol}>
                      <Text style={styles.matrixRoleHeader} numberOfLines={2}>
                        {column.label}
                      </Text>
                    </View>
                  ))}
                </View>
                {matrixRows.map(row => (
                  <View key={row.id} style={styles.matrixRow}>
                    <View style={styles.matrixModuleCol}>
                      <Text style={styles.matrixModuleLabel}>{row.label}</Text>
                    </View>
                    {matrixColumns.map(column => (
                      <View key={column.id} style={styles.matrixRoleCol}>
                        <GrantIcon
                          allowed={!!row.grants[column.id]}
                          onPress={() => toggleGrant(row.id, column.id)}
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Role details</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Role name"
                placeholderTextColor={colors.textSoft}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe this role"
                placeholderTextColor={colors.textSoft}
                multiline
                style={styles.textarea}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>Active</Text>
                <Text style={styles.toggleHint}>
                  Inactive roles can't be assigned
                </Text>
              </View>
              <Switch
                value={active}
                onValueChange={setActive}
                trackColor={{
                  false: colors.border,
                  true: colors.successBright,
                }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
