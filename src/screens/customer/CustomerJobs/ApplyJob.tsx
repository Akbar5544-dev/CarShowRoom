import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Screen} from '../../../components';
import {C} from '../shared/tokens';
import {jobById} from './module';

type Params = {CustomerApplyJob: {jobId: string}};

type Mode = 'upload' | 'manual';

export function CustomerApplyJob() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Params, 'CustomerApplyJob'>>();
  const insets = useSafeAreaInsets();
  const job = jobById(route.params.jobId);
  const [mode, setMode] = useState<Mode>('upload');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [cover, setCover] = useState('');
  const [cvLabel, setCvLabel] = useState<string | null>(null);

  const submit = () => {
    if (mode === 'upload' && !cvLabel) {
      Alert.alert('CV required', 'Please upload your CV first.');
      return;
    }
    if (mode === 'manual') {
      if (!name.trim() || !phone.trim()) {
        Alert.alert('Missing info', 'Name and phone are required.');
        return;
      }
    }
    Alert.alert('Application sent', `Applied to ${job.title} at ${job.company}.`, [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 8)}]}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevronLeft" size={16} color={C.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Apply for Job</Text>
        <View style={{width: 34}} />
      </View>

      <ScrollView
        contentContainerStyle={{padding: 16, paddingBottom: 100 + insets.bottom}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.jobCard}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCompany}>
            {job.company} · {job.location} · {job.pay}
          </Text>
        </View>

        <Text style={styles.section}>How do you want to apply?</Text>
        <View style={styles.modeRow}>
          {([
            {id: 'upload' as const, label: 'Upload CV'},
            {id: 'manual' as const, label: 'Fill manually'},
          ]).map(m => {
            const on = mode === m.id;
            return (
              <Pressable
                key={m.id}
                style={[styles.modeChip, on && styles.modeChipOn]}
                onPress={() => setMode(m.id)}>
                <Text style={[styles.modeText, on && styles.modeTextOn]}>
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {mode === 'upload' ? (
          <Pressable
            style={styles.upload}
            onPress={() => setCvLabel('My_CV.pdf')}>
            <Icon name="plusOutline" size={22} color={C.primary} />
            <Text style={styles.uploadTitle}>
              {cvLabel ? cvLabel : 'Tap to upload CV'}
            </Text>
            <Text style={styles.uploadHint}>PDF or DOC · max 5 MB</Text>
          </Pressable>
        ) : (
          <View style={styles.form}>
            {(
              [
                {label: 'Full name', value: name, set: setName, ph: 'Your name'},
                {label: 'Phone', value: phone, set: setPhone, ph: '03XX XXXXXXX'},
                {label: 'Email', value: email, set: setEmail, ph: 'you@email.com'},
                {
                  label: 'Experience (years)',
                  value: experience,
                  set: setExperience,
                  ph: 'e.g. 3',
                },
              ] as const
            ).map(f => (
              <View key={f.label} style={styles.field}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  style={styles.input}
                  value={f.value}
                  onChangeText={f.set}
                  placeholder={f.ph}
                  placeholderTextColor={C.muted}
                  keyboardType={
                    f.label === 'Phone' || f.label.includes('Experience')
                      ? 'numeric'
                      : 'default'
                  }
                />
              </View>
            ))}
            <View style={styles.field}>
              <Text style={styles.label}>Cover note</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={cover}
                onChangeText={setCover}
                placeholder="Short intro..."
                placeholderTextColor={C.muted}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bar, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>Submit Application</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: C.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {fontSize: 16, fontWeight: '700', color: C.text},
  jobCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 16,
  },
  jobTitle: {fontSize: 15, fontWeight: '700', color: C.text},
  jobCompany: {fontSize: 12, color: C.muted, marginTop: 4},
  section: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  modeRow: {flexDirection: 'row', gap: 8, marginBottom: 14},
  modeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    alignItems: 'center',
  },
  modeChipOn: {backgroundColor: '#eff6ff', borderColor: '#93c5fd'},
  modeText: {fontSize: 12, fontWeight: '700', color: C.text},
  modeTextOn: {color: C.primary},
  upload: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#93c5fd',
    borderStyle: 'dashed',
    paddingVertical: 36,
    alignItems: 'center',
    gap: 6,
  },
  uploadTitle: {fontSize: 13, fontWeight: '700', color: C.primary},
  uploadHint: {fontSize: 11, color: C.muted},
  form: {gap: 12},
  field: {gap: 6},
  label: {fontSize: 11, fontWeight: '700', color: C.muted, textTransform: 'uppercase'},
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: C.white,
    color: C.text,
    fontSize: 14,
  },
  textarea: {height: 100, paddingTop: 10},
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: C.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
  },
  submit: {
    height: 44,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {color: '#fff', fontWeight: '700', fontSize: 14},
});
