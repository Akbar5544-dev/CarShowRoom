import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Images} from '../../../assets';
import {Icon, SaveInspectionModal, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {createStyles} from './styles';
import {useReturnVehicleController} from './useController';

export function ReturnVehicle() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    rentalSummary,
    vehicle,
    inspectionStats,
    charges,
    invoice,
    setChargeAmount,
    isSaveModalVisible,
    onInspectionPhotoPress,
    onBackPress,
    onSaveInspection,
    onCloseSaveModal,
    onConfirmSaveInspection,
    onCompleteReturn,
    onChargeComplete,
  } = useReturnVehicleController();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.main}>
          <View style={styles.pageHeader}>
            <View style={styles.titleRow}>
              <Pressable
                style={styles.backBtn}
                onPress={onBackPress}
                accessibilityLabel="Go back"
                hitSlop={8}>
                <Icon name="arrowLeft" size={12} color={colors.white} />
              </Pressable>
              <View style={{flex: 1}}>
                <Text style={styles.pageTitle}>Return Vehicle</Text>
                <Text style={styles.pageSubtitle}>{rentalSummary}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.secondaryBtn} onPress={onSaveInspection}>
                <Text style={styles.secondaryBtnText}>Save Inspection</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onCompleteReturn}>
                <Icon name="activityCheck" size={12} color={colors.white} />
                <Text style={styles.primaryBtnText}>Complete Return</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <View>
              <Text style={styles.stepEyebrow}>Step 1</Text>
              <Text style={styles.stepTitle}>Vehicle Inspection</Text>
            </View>

            <View style={styles.vehicleCard}>
              <View style={styles.vehicleImageWrap}>
                <Image
                  source={Images.fleetVehicle}
                  style={styles.vehicleImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vin}>{vehicle.vin}</Text>
                <Text style={styles.vehicleTitle}>{vehicle.title}</Text>
                <Text style={styles.vehicleSpecs}>{vehicle.specs}</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              {inspectionStats.map(stat => {
                const isPhotos = stat.id === 'photos';
                const Cell = isPhotos ? Pressable : View;
                return (
                  <Cell
                    key={stat.id}
                    style={styles.statCell}
                    {...(isPhotos
                      ? {
                          onPress: onInspectionPhotoPress,
                          accessibilityLabel: 'Upload inspection photos',
                        }
                      : {})}>
                    <View style={styles.statIcon}>
                      <Icon name={stat.icon} size={15} />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statNote} numberOfLines={1}>
                        {stat.note}
                      </Text>
                    </View>
                  </Cell>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <View>
              <Text style={styles.stepEyebrow}>Step 2</Text>
              <Text style={styles.stepTitle}>Extra Charges</Text>
            </View>
            <View style={styles.chargesList}>
              {charges.map(charge => (
                <View key={charge.id} style={styles.chargeRow}>
                  <Text style={styles.chargeLabel} numberOfLines={1}>
                    {charge.label}
                  </Text>
                  <View style={styles.chargeInputWrap}>
                    <TextInput
                      value={charge.amount}
                      onChangeText={text => setChargeAmount(charge.id, text)}
                      style={styles.chargeInput}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      textAlign="right"
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View>
              <Text style={styles.stepEyebrow}>Preview</Text>
              <Text style={styles.stepTitle}>Final Invoice</Text>
            </View>

            <View style={styles.invoiceSummary}>
              <View style={styles.invoiceSummaryCol}>
                <Text style={styles.invoiceLabel}>Rental total</Text>
                <Text style={styles.invoiceValue}>{invoice.rentalTotal}</Text>
              </View>
              <View style={styles.invoiceSummaryCol}>
                <Text style={styles.invoiceLabel}>Extras</Text>
                <Text style={styles.invoiceValue}>{invoice.extras}</Text>
              </View>
            </View>

            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Subtotal</Text>
              <Text style={styles.lineValue}>{invoice.subtotal}</Text>
            </View>
            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Deposit refund</Text>
              <Text style={[styles.lineValue, styles.refundValue]}>
                {invoice.depositRefund}
              </Text>
            </View>
            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Tax (18%)</Text>
              <Text style={styles.lineValue}>{invoice.tax}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Amount due</Text>
              <Text style={styles.totalValue}>{invoice.amountDue}</Text>
            </View>

            <Pressable style={styles.chargeBtn} onPress={onChargeComplete}>
              <Icon name="activityDollar" size={12} color={colors.white} />
              <Text style={styles.chargeBtnText}>Charge & Complete</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <SaveInspectionModal
        visible={isSaveModalVisible}
        onClose={onCloseSaveModal}
        onConfirm={onConfirmSaveInspection}
      />
    </Screen>
  );
}
