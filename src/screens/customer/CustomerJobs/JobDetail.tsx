import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import {Icon, Screen} from '../../../components';
import type {CustomerJobsStackParamList} from '../../../navigation/types';
import {publicSiteJobsService} from '../../../services';
import {useAppSelector} from '../../../store/hooks';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {unwrapData} from '../../../utils/apiHelpers';
import {
  mapPublicJobDetail,
  type PublicJobDetail,
} from '../../../utils/publicJobs';
import {createStyles} from './styles';

type DetailRoute = RouteProp<CustomerJobsStackParamList, 'CustomerJobDetail'>;
type DetailNav = NativeStackNavigationProp<
  CustomerJobsStackParamList,
  'CustomerJobDetail'
>;

type ApplyForm = {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  resume_url: string;
  cover_note: string;
};

export function CustomerJobDetail() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation<DetailNav>();
  const route = useRoute<DetailRoute>();
  const user = useAppSelector(state => state.app.user);
  const userName = useAppSelector(state => state.app.userName);

  const [job, setJob] = useState<PublicJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ApplyForm>({
    full_name: userName || '',
    email: typeof user?.email === 'string' ? user.email : '',
    phone: '',
    city: '',
    resume_url: '',
    cover_note: '',
  });

  const idOrSlug = route.params.idOrSlug;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await publicSiteJobsService.getPublicJobsById(idOrSlug);
      setJob(mapPublicJobDetail(unwrapData(res)));
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load job'),
        type: 'danger',
      });
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = <K extends keyof ApplyForm>(key: K, value: ApplyForm[K]) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const onSubmitApply = async () => {
    setSubmitting(true);
    try {
      const body: Record<string, string> = {};
      (Object.keys(form) as (keyof ApplyForm)[]).forEach(key => {
        const value = form[key].trim();
        if (value) {
          body[key] = value;
        }
      });
      await publicSiteJobsService.applyPublicJobsById(idOrSlug, body);
      setApplyOpen(false);
      showMessage({message: 'Application submitted', type: 'success'});
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to submit application'),
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const title = job?.title || route.params.title || 'Job details';

  return (
    <Screen style={styles.container}>
      <View style={styles.detailHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back">
          <Icon name="arrowLeft" size={12} color={colors.white} />
        </Pressable>
        <Text style={styles.detailTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.actionBlue} />
      ) : !job ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Job not found</Text>
          <Text style={styles.emptyText}>
            This opening may have closed or the link is invalid.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.sectionCard}>
              <Text style={styles.meta}>
                {job.showroomName} · {job.department}
              </Text>
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Icon name="location" size={12} color={colors.textSoft} />
                  <Text style={styles.detailText}>{job.city}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="briefcase" size={12} color={colors.textSoft} />
                  <Text style={styles.detailText}>{job.employmentType}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="customers" size={12} color={colors.textSoft} />
                  <Text style={styles.detailText}>
                    {job.openings} opening{job.openings === '1' ? '' : 's'}
                  </Text>
                </View>
              </View>
              <Text style={styles.salary}>{job.salaryLabel}</Text>
              {job.deadline ? (
                <Text style={styles.detailText}>Deadline: {job.deadline}</Text>
              ) : null}
            </View>

            {job.description ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionLabel}>About the role</Text>
                <Text style={styles.sectionBody}>{job.description}</Text>
              </View>
            ) : null}
            {job.responsibilities ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionLabel}>Responsibilities</Text>
                <Text style={styles.sectionBody}>{job.responsibilities}</Text>
              </View>
            ) : null}
            {job.requirements ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionLabel}>Requirements</Text>
                <Text style={styles.sectionBody}>{job.requirements}</Text>
              </View>
            ) : null}
            {job.benefits ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionLabel}>Benefits</Text>
                <Text style={styles.sectionBody}>{job.benefits}</Text>
              </View>
            ) : null}
            {!job.description &&
            !job.responsibilities &&
            !job.requirements &&
            !job.benefits ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionBody}>
                  Full description will appear here once the showroom adds
                  details for this role.
                </Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.applyBar}>
            <Pressable
              style={styles.applyBtn}
              onPress={() => setApplyOpen(true)}>
              <Text style={styles.applyBtnText}>Apply now</Text>
            </Pressable>
          </View>
        </>
      )}

      <Modal
        transparent
        animationType="slide"
        visible={applyOpen}
        onRequestClose={() => setApplyOpen(false)}>
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable
            style={{flex: 1}}
            onPress={() => setApplyOpen(false)}
          />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Apply for {title}</Text>
            <Text style={styles.modalHint}>
              Fields are optional — add what you can and submit.
            </Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              {(
                [
                  ['full_name', 'Full name'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['city', 'City'],
                  ['resume_url', 'Resume URL'],
                ] as const
              ).map(([key, label]) => (
                <View key={key}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={form[key]}
                    onChangeText={text => setField(key, text)}
                    autoCapitalize={key === 'email' ? 'none' : 'words'}
                    keyboardType={
                      key === 'email'
                        ? 'email-address'
                        : key === 'phone'
                          ? 'phone-pad'
                          : 'default'
                    }
                  />
                </View>
              ))}
              <Text style={styles.fieldLabel}>Cover note</Text>
              <TextInput
                style={[styles.fieldInput, styles.fieldArea]}
                value={form.cover_note}
                onChangeText={text => setField('cover_note', text)}
                multiline
              />
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalSecondary}
                onPress={() => setApplyOpen(false)}
                disabled={submitting}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalPrimary,
                  submitting && styles.applyBtnDisabled,
                ]}
                onPress={onSubmitApply}
                disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalPrimaryText}>Submit</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}
