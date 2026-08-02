import React, {memo} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Icon} from '../../../components/Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../../../theme';
import type {LedgerInvoice} from './module';

type Props = {
  visible: boolean;
  invoice: LedgerInvoice | null;
  email: string;
  message: string;
  onChangeEmail: (text: string) => void;
  onChangeMessage: (text: string) => void;
  onClose: () => void;
  onCopyLink: () => void;
  onQuickShare: (channel: 'email' | 'whatsapp' | 'copy') => void;
  onSend: () => void;
};

export const ShareInvoiceModal = memo(function ShareInvoiceModal({
  visible,
  invoice,
  email,
  message,
  onChangeEmail,
  onChangeMessage,
  onClose,
  onCopyLink,
  onQuickShare,
  onSend,
}: Props) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  if (!invoice) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={{flex: 1, gap: 6}}>
              <Text style={styles.ref}>#{invoice.code}</Text>
              <View style={styles.amountBadge}>
                <Text style={styles.amountText}>{invoice.amountLabel}</Text>
              </View>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Icon name="closeCross" size={14} color={colors.textSoft} />
            </Pressable>
          </View>

          <Text style={styles.label}>Public sharing link</Text>
          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>
              {invoice.shareUrl}
            </Text>
            <Pressable style={styles.copyBtn} onPress={onCopyLink}>
              <Icon name="documentFile" size={12} color={colors.actionBlue} />
            </Pressable>
          </View>

          <View style={styles.quickRow}>
            {(
              [
                {id: 'email', label: 'Email', icon: 'email' as const},
                {id: 'whatsapp', label: 'WhatsApp', icon: 'phone' as const},
                {id: 'copy', label: 'Copy text', icon: 'documentFile' as const},
              ] as const
            ).map(item => (
              <Pressable
                key={item.id}
                style={styles.quickItem}
                onPress={() => onQuickShare(item.id)}>
                <View style={styles.quickIcon}>
                  <Icon name={item.icon} size={14} color={colors.actionBlue} />
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Recipient email</Text>
          <TextInput
            value={email}
            onChangeText={onChangeEmail}
            placeholder="client@email.com"
            placeholderTextColor={colors.textSoft}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <Text style={styles.label}>Message (optional)</Text>
          <TextInput
            value={message}
            onChangeText={onChangeMessage}
            placeholder="Add a short note"
            placeholderTextColor={colors.textSoft}
            multiline
            style={[styles.input, styles.message]}
          />

          <Pressable style={styles.sendBtn} onPress={onSend}>
            <Text style={styles.sendText}>Send invoice →</Text>
          </Pressable>
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
      justifyContent: 'center',
      paddingHorizontal: 18,
    },
    backdropTap: {...StyleSheet.absoluteFill},
    card: {
      backgroundColor: c.surface,
      borderRadius: 24,
      padding: 18,
      gap: 10,
      zIndex: 1,
    },
    header: {flexDirection: 'row', marginBottom: 4},
    ref: {fontSize: 18, fontWeight: '700', color: c.textDark},
    amountBadge: {
      alignSelf: 'flex-start',
      backgroundColor: c.actionTint12,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    amountText: {fontSize: 12, fontWeight: '700', color: c.actionBlue},
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: c.track,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 10,
      fontWeight: '700',
      color: c.textSoft,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginTop: 4,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 0.75,
      borderColor: c.border,
      borderRadius: 14,
      paddingLeft: 12,
      paddingRight: 6,
      height: 42,
    },
    linkText: {flex: 1, fontSize: 12, color: c.textDark},
    copyBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.actionTint08,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 6,
    },
    quickItem: {alignItems: 'center', gap: 6, width: '30%'},
    quickIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.actionTint08,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickLabel: {fontSize: 11, fontWeight: '600', color: c.textDark},
    input: {
      borderWidth: 0.75,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 13,
      color: c.textDark,
      backgroundColor: c.surface,
    },
    message: {minHeight: 72, textAlignVertical: 'top'},
    sendBtn: {
      marginTop: 8,
      height: 46,
      borderRadius: 23,
      backgroundColor: c.actionBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendText: {fontSize: 15, fontWeight: '700', color: c.white},
  });
}
