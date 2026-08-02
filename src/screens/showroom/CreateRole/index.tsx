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
import {useThemedStyles, useThemeColors, colors} from '../../../theme';
import type {
  AssignableUser,
  CreateRoleStepId,
  PermissionModuleRow,
  PermissionRoleColumn,
  RolePreset,
} from './module';
import {createStyles} from './styles';
import {useCreateRoleController} from './useController';

function PresetCard({
  preset,
  active,
  onPress,
}: {
  preset: RolePreset;
  active: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      style={[styles.presetCard, active && styles.presetCardActive]}
      onPress={onPress}>
      <View style={[styles.presetIcon, active && styles.presetIconActive]}>
        <Icon
          name={preset.icon}
          size={15}
          color={active ? colors.white : colors.textSecondary}
        />
      </View>
      <Text style={styles.presetTitle}>{preset.title}</Text>
      <Text style={styles.presetDescription}>{preset.description}</Text>
    </Pressable>
  );
}

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
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={allowed ? 'Allowed' : 'Denied'}>
      <Text style={allowed ? styles.grantYesText : styles.grantNoText}>
        {allowed ? '✓' : '✕'}
      </Text>
    </Pressable>
  );
}

function PermissionsStep({
  columns,
  rows,
  onToggle,
}: {
  columns: {id: PermissionRoleColumn; label: string}[];
  rows: PermissionModuleRow[];
  onToggle: (moduleId: string, columnId: PermissionRoleColumn) => void;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Permission Matrix</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.matrixScroll}>
        <View style={styles.matrix}>
          <View style={styles.matrixHeaderRow}>
            <View style={styles.matrixModuleCol}>
              <Text style={styles.matrixModuleHeader}>Module</Text>
            </View>
            {columns.map(column => (
              <View key={column.id} style={styles.matrixRoleCol}>
                <Text style={styles.matrixRoleHeader} numberOfLines={2}>
                  {column.label}
                </Text>
              </View>
            ))}
          </View>
          {rows.map(row => (
            <View key={row.id} style={styles.matrixRow}>
              <View style={styles.matrixModuleCol}>
                <Text style={styles.matrixModuleLabel}>{row.label}</Text>
              </View>
              {columns.map(column => (
                <View key={column.id} style={styles.matrixRoleCol}>
                  <GrantIcon
                    allowed={row.grants[column.id]}
                    onPress={() => onToggle(row.id, column.id)}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function AssignUsersStep({
  users,
  assignedUserIds,
  onToggle,
}: {
  users: AssignableUser[];
  assignedUserIds: string[];
  onToggle: (userId: string) => void;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.presetHeader}>
        <Text style={styles.optional}>Optional — you can do this later</Text>
        <Text style={styles.cardTitle}>Assign users</Text>
      </View>
      <View style={styles.userList}>
        {users.length === 0 ? (
          <Text style={styles.userEmail}>No employees found</Text>
        ) : (
          users.map(user => {
            const assigned = assignedUserIds.includes(user.id);
            return (
              <View key={user.id} style={styles.userRow}>
                <View
                  style={[
                    styles.userAvatar,
                    {backgroundColor: user.avatarColor},
                  ]}>
                  <Text style={styles.userAvatarText}>{user.initials}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <Pressable
                  style={[styles.assignBtn, assigned && styles.assignBtnActive]}
                  onPress={() => onToggle(user.id)}>
                  <Text
                    style={[
                      styles.assignBtnText,
                      assigned && styles.assignBtnTextActive,
                    ]}>
                    {assigned ? 'Assigned' : 'Assign'}
                  </Text>
                </Pressable>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

function ReviewStep({
  name,
  status,
  description,
  permissions,
  members,
  active,
}: {
  name: string;
  status: string;
  description: string;
  permissions: string;
  members: string;
  active: boolean;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Review & create</Text>
      <View style={styles.reviewGrid}>
        <View style={styles.reviewRow}>
          <View style={styles.reviewCell}>
            <Text style={styles.reviewLabel}>Name</Text>
            <Text style={styles.reviewValue}>{name}</Text>
          </View>
          <View style={styles.reviewCell}>
            <Text style={styles.reviewLabel}>Status</Text>
            <Text
              style={[
                styles.reviewValue,
                active
                  ? styles.summaryStatusActive
                  : styles.summaryStatusInactive,
              ]}>
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.reviewCellFull}>
          <Text style={styles.reviewLabel}>Description</Text>
          <Text style={styles.reviewValue}>{description}</Text>
        </View>

        <View style={styles.reviewRow}>
          <View style={styles.reviewCell}>
            <Text style={styles.reviewLabel}>Permissions</Text>
            <Text style={styles.reviewValue}>{permissions}</Text>
          </View>
          <View style={styles.reviewCell}>
            <Text style={styles.reviewLabel}>Members</Text>
            <Text style={styles.reviewValue}>{members}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function CreateRole() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    currentStep,
    steps,
    form,
    presets,
    permissionColumns,
    permissionRows,
    assignableUsers,
    assignedUserIds,
    summaryName,
    summaryPreset,
    summaryPermissions,
    summaryMembers,
    summaryStatus,
    reviewName,
    reviewDescription,
    reviewPermissions,
    reviewMembers,
    canGoPrevious,
    isLastStep,
    isSubmitting,
    setName,
    setDescription,
    setActiveOnCreation,
    setPreset,
    toggleGrant,
    toggleAssignUser,
    onStepPress,
    onBackPress,
    onPreviousPress,
    onContinuePress,
  } = useCreateRoleController();

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
            <View style={styles.titleLeft}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={14} color={colors.white} />
              </Pressable>
              <View style={styles.titleBlock}>
                <Text style={styles.pageTitle}>Create a new role</Text>
                <Text style={styles.pageSubtitle}>
                  Define scope, permissions, and initial members
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stepper}>
            {steps.map((step, index) => {
              const active = step.id === currentStep;
              const completed = step.id < currentStep;
              return (
                <React.Fragment key={step.id}>
                  {index > 0 ? (
                    <View
                      style={[
                        styles.stepConnector,
                        step.id <= currentStep && styles.stepConnectorCompleted,
                      ]}
                    />
                  ) : null}
                  <Pressable
                    style={[
                      styles.stepPill,
                      completed && styles.stepPillCompleted,
                      active && styles.stepPillActive,
                    ]}
                    onPress={() => onStepPress(step.id as CreateRoleStepId)}>
                    <View
                      style={[
                        styles.stepNumber,
                        completed && styles.stepNumberCompleted,
                        active && styles.stepNumberActive,
                      ]}>
                      <Text
                        style={[
                          styles.stepNumberText,
                          completed && styles.stepNumberTextCompleted,
                          active && styles.stepNumberTextActive,
                        ]}>
                        {step.id + 1}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        completed && styles.stepLabelCompleted,
                        active && styles.stepLabelActive,
                      ]}
                      numberOfLines={1}>
                      {step.label}
                    </Text>
                  </Pressable>
                </React.Fragment>
              );
            })}
          </ScrollView>

          {currentStep === 0 ? (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Role details</Text>

                <View style={styles.field}>
                  <Text style={styles.label}>Role name</Text>
                  <TextInput
                    value={form.name}
                    onChangeText={setName}
                    placeholder="e.g. Regional Fleet Manager"
                    placeholderTextColor={colors.textSoft}
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    value={form.description}
                    onChangeText={setDescription}
                    placeholder="What can users with this role do?"
                    placeholderTextColor={colors.textSoft}
                    multiline
                    style={styles.textarea}
                  />
                </View>

                <View style={styles.toggleRow}>
                  <View style={styles.toggleCopy}>
                    <Text style={styles.toggleTitle}>Active on creation</Text>
                    <Text style={styles.toggleHint}>
                      Inactive roles can't be assigned yet
                    </Text>
                  </View>
                  <Switch
                    value={form.activeOnCreation}
                    onValueChange={setActiveOnCreation}
                    trackColor={{
                      false: colors.border,
                      true: colors.actionBlue,
                    }}
                    thumbColor={colors.white}
                  />
                </View>
              </View>

              <View style={styles.card}>
                <View style={styles.presetHeader}>
                  <Text style={styles.optional}>Optional</Text>
                  <Text style={styles.cardTitle}>Start from a preset</Text>
                </View>
                <View style={styles.presetGrid}>
                  {presets.map(preset => (
                    <PresetCard
                      key={preset.id}
                      preset={preset}
                      active={form.preset === preset.id}
                      onPress={() => setPreset(preset.id)}
                    />
                  ))}
                </View>
              </View>
            </>
          ) : null}

          {currentStep === 1 ? (
            <PermissionsStep
              columns={permissionColumns}
              rows={permissionRows}
              onToggle={toggleGrant}
            />
          ) : null}

          {currentStep === 2 ? (
            <AssignUsersStep
              users={assignableUsers}
              assignedUserIds={assignedUserIds}
              onToggle={toggleAssignUser}
            />
          ) : null}

          {currentStep === 3 ? (
            <ReviewStep
              name={reviewName}
              status={summaryStatus}
              description={reviewDescription}
              permissions={reviewPermissions}
              members={reviewMembers}
              active={form.activeOnCreation}
            />
          ) : null}

          <View style={styles.navRow}>
            <Pressable
              style={[
                styles.previousBtn,
                !canGoPrevious && styles.previousBtnDisabled,
              ]}
              onPress={onPreviousPress}
              disabled={!canGoPrevious}>
              <Text style={styles.previousBtnText}>Previous</Text>
            </Pressable>
            <Pressable
              style={[
                styles.continueBtn,
                isSubmitting && styles.previousBtnDisabled,
              ]}
              onPress={onContinuePress}
              disabled={isSubmitting}>
              <Text style={styles.continueBtnText}>
                {isLastStep
                  ? isSubmitting
                    ? 'Creating…'
                    : 'Create role'
                  : 'Continue'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryList}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Name</Text>
                <Text style={styles.summaryValue}>{summaryName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Preset</Text>
                <Text style={styles.summaryValue}>{summaryPreset}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Permissions</Text>
                <Text style={styles.summaryValue}>{summaryPermissions}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Members</Text>
                <Text style={styles.summaryValue}>{summaryMembers}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Status</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    form.activeOnCreation
                      ? styles.summaryStatusActive
                      : styles.summaryStatusInactive,
                  ]}>
                  {summaryStatus}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
