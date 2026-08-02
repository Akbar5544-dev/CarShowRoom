import React, {memo, useEffect, useMemo, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from './Icon';
import {type AppColors, useThemedStyles, useThemeColors} from '../theme';

export type ExportFormat = 'csv' | 'excel' | 'pdf';

const FORMATS: {id: ExportFormat; label: string; mark: string}[] = [
  {id: 'csv', label: 'CSV', mark: 'CSV'},
  {id: 'excel', label: 'Excel', mark: 'X'},
  {id: 'pdf', label: 'PDF', mark: 'PDF'},
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type ExportPdfModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm?: (format: ExportFormat, monthLabel: string) => void;
  initialFormat?: ExportFormat;
};

export const ExportPdfModal = memo(function ExportPdfModal({
  visible,
  onClose,
  onConfirm,
  initialFormat = 'pdf',
}: ExportPdfModalProps) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [format, setFormat] = useState<ExportFormat>(initialFormat);
  const [monthIndex, setMonthIndex] = useState(6); // July
  const [year, setYear] = useState(2026);

  useEffect(() => {
    if (visible) {
      setFormat(initialFormat);
      setMonthIndex(6);
      setYear(2026);
    }
  }, [visible, initialFormat]);

  const monthLabel = useMemo(
    () => `${MONTHS[monthIndex]} ${year}`,
    [monthIndex, year],
  );

  const onPrevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(prev => prev - 1);
      return;
    }
    setMonthIndex(prev => prev - 1);
  };

  const onNextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(prev => prev + 1);
      return;
    }
    setMonthIndex(prev => prev + 1);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>EXPORT</Text>
          <Text style={styles.title}>Export PDF</Text>
          <Text style={styles.subtitle}>
            Choose an export format for the current view.
          </Text>

          <View style={styles.monthRow}>
            <View style={styles.monthPill}>
              <Pressable style={styles.monthArrow} onPress={onPrevMonth}>
                <Icon name="arrowLeft" size={10} color={colors.actionBlue} />
              </Pressable>
              <Icon name="calendarField" size={12} color={colors.actionBlue} />
              <Text style={styles.monthText}>{monthLabel}</Text>
              <Pressable style={styles.monthArrow} onPress={onNextMonth}>
                <Icon name="arrowRight" size={10} color={colors.actionBlue} />
              </Pressable>
            </View>
          </View>

          <View style={styles.formatRow}>
            {FORMATS.map(item => {
              const selected = item.id === format;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.formatCard, selected && styles.formatCardActive]}
                  onPress={() => setFormat(item.id)}>
                  <View style={styles.fileIcon}>
                    <View style={styles.fileFold} />
                    <Text style={styles.fileMark}>{item.mark}</Text>
                  </View>
                  <Text style={styles.formatLabel}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.confirmBtn}
              onPress={() => {
                onConfirm?.(format, monthLabel);
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
    paddingHorizontal: 22,
    paddingTop: 24,
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
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: c.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: c.textDark,
    lineHeight: 18,
    marginBottom: 14,
  },
  monthRow: {
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 0.75,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  monthArrow: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 11,
    fontWeight: '600',
    color: c.actionBlue,
  },
  formatRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formatCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: c.border,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  formatCardActive: {
    borderColor: c.actionBlue,
  },
  fileIcon: {
    width: 36,
    height: 44,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: c.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fileFold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: c.actionBlue,
    borderBottomLeftRadius: 4,
  },
  fileMark: {
    fontSize: 8,
    fontWeight: '800',
    color: c.actionBlue,
    letterSpacing: 0.2,
  },
  formatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: c.textDark,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 16,
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
    minWidth: 88,
    height: 30,
    borderRadius: 15,
    backgroundColor: c.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.white,
  },
});
}
