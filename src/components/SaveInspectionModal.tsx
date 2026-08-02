import React, {memo} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

type SaveInspectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

export const SaveInspectionModal = memo(function SaveInspectionModal({
  visible,
  onClose,
  onConfirm,
}: SaveInspectionModalProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>confirm</Text>
          <Text style={styles.title}>Save Inspection</Text>

          <View style={styles.messageBox}>
            <View style={styles.iconWrap}>
              <Icon name="saveDraft" size={17} color={colors.actionBlue} />
            </View>
            <Text style={styles.message}>
              Are you sure you want to Save Inspection? This will apply to the
              current selection.
            </Text>
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.confirmBtn}
              onPress={() => {
                onConfirm?.();
                onClose();
              }}>
              <Text style={styles.confirmText}>Confirm</Text>
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
    paddingHorizontal: 20,
  },
  backdropTap: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 353,
    backgroundColor: c.surface,
    borderRadius: 28,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: c.actionBlue,
    letterSpacing: 0.4,
    textTransform: 'lowercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: c.textDark,
    marginBottom: 16,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderRadius: 18,
    borderWidth: 0.75,
    borderColor: c.borderSoft,
    backgroundColor: 'rgba(237,242,248,0.55)',
    padding: 18,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.actionTint12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: c.textSoft,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 0.75,
    borderTopColor: c.borderSoft,
  },
  cancelBtn: {
    minWidth: 68,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.75,
    borderColor: c.border,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '500',
    color: c.textDark,
  },
  confirmBtn: {
    minWidth: 72,
    height: 30,
    borderRadius: 15,
    backgroundColor: c.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.white,
  },
});
}
