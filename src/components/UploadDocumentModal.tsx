import React, {memo} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type UploadDocumentModalProps = {
  visible: boolean;
  submitting?: boolean;
  selectedFileName?: string | null;
  selectedCount?: number;
  onClose: () => void;
  onUploadPress?: () => void;
  onPickPress?: () => void;
};

export const UploadDocumentModal = memo(function UploadDocumentModal({
  visible,
  submitting = false,
  selectedFileName,
  selectedCount = 0,
  onClose,
  onUploadPress,
  onPickPress,
}: UploadDocumentModalProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const hasSelection = Boolean(selectedFileName) || selectedCount > 0;
  const canUpload = hasSelection && !submitting;
  const selectionHint =
    selectedCount > 1
      ? `${selectedCount} photos selected`
      : selectedFileName ?? 'Tap to add photos · multi-select';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>UPLOAD</Text>
          <Text style={styles.title}>Upload Document</Text>
          <Text style={styles.subtitle}>Choose one or more photos</Text>

          <Pressable
            style={styles.dropzone}
            onPress={onPickPress}
            disabled={submitting}>
            <Icon name="uploadArrow" size={28} color={colors.actionBlue} />
            <Text style={styles.dropTitle}>
              {hasSelection ? 'Add more photos' : 'Upload'}
            </Text>
            <Text style={styles.dropHint}>{selectionHint}</Text>
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.footer}>
            <Pressable
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={submitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.uploadBtn, !canUpload && styles.uploadBtnDisabled]}
              disabled={!canUpload}
              onPress={onUploadPress}>
              {submitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.uploadText}>Upload</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});

function createStyles(c: AppColors) {
  return StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 17, 35, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  backdropTap: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: c.surface,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: c.actionBlue,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: c.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: c.textSoft,
    marginBottom: 18,
  },
  dropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: c.actionBlue,
    borderRadius: 18,
    backgroundColor: c.actionTint04,
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 6,
  },
  dropTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: c.actionBlue,
    marginTop: 4,
  },
  dropHint: {
    fontSize: 12,
    color: c.textSoft,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: c.border,
    marginTop: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelBtn: {
    minWidth: 96,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.75,
    borderColor: c.border,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: c.textDark,
  },
  uploadBtn: {
    minWidth: 96,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  uploadBtnDisabled: {
    opacity: 0.5,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: c.white,
  },
});
}
