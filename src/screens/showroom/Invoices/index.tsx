import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Icon, MetricCard, Screen, SearchFilterBar} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import {InvoiceDetailsModal} from './InvoiceDetailsModal';
import {LedgerCreateInvoiceModal} from './LedgerCreateInvoiceModal';
import {ShareInvoiceModal} from './ShareInvoiceModal';
import {createStyles} from './styles';
import {useInvoicesController} from './useController';

export function Invoices() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    metrics,
    search,
    invoices,
    isCreateVisible,
    isDetailsVisible,
    isShareVisible,
    selectedInvoice,
    createForm,
    createTotalLabel,
    shareEmail,
    shareMessage,
    setSearch,
    setShareEmail,
    setShareMessage,
    updateCreateField,
    updateLineItem,
    onAddLineRow,
    onRemoveLineRow,
    onBackPress,
    onExportPress,
    onOpenCreate,
    onCloseCreate,
    onConfirmCreate,
    onOpenDetails,
    onCloseDetails,
    onOpenShare,
    onCloseShare,
    onSendShare,
    onCopyLink,
    onQuickShare,
    onDownloadPress,
  } = useInvoicesController();

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
              <View style={styles.titleCopy}>
                <Text style={styles.pageTitle}>Invoices</Text>
                <Text style={styles.pageSubtitle}>
                  Accounts receivable & payable across the ledger
                </Text>
              </View>
              <Pressable style={styles.menuBtn} accessibilityLabel="More">
                <Icon name="activityMenu" size={16} color={colors.textSoft} />
              </Pressable>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.secondaryBtn} onPress={onExportPress}>
                <Icon name="download" size={12} color={colors.textDark} />
                <Text style={styles.secondaryBtnText}>Export</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onOpenCreate}>
                <Icon name="addPlus" size={12} color={colors.white} />
                <Text style={styles.primaryBtnText}>Invoice</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            {metrics.map(item => (
              <MetricCard key={item.id} item={item} />
            ))}
          </View>

          <View style={styles.listCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>AR / AP</Text>
              <Text style={styles.sectionTitle}>All Invoices</Text>
            </View>

            <SearchFilterBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search invoices..."
            />

            <View style={styles.listGap}>
              {invoices.length === 0 ? (
                <Text style={styles.emptyText}>No invoices found</Text>
              ) : (
                invoices.map(invoice => (
                  <View key={invoice.id} style={styles.invoiceCard}>
                    <View style={styles.invoiceGrid}>
                      <View style={styles.invoiceCell}>
                        <Text style={styles.cellLabel}>Invoice</Text>
                        <Pressable onPress={() => onOpenDetails(invoice)}>
                          <Text style={styles.cellLink}>{invoice.code}</Text>
                        </Pressable>
                      </View>
                      <View style={styles.invoiceCell}>
                        <Text style={styles.cellLabel}>Type</Text>
                        <Text style={styles.cellValue}>{invoice.type}</Text>
                      </View>
                      <View style={styles.invoiceCell}>
                        <Text style={styles.cellLabel}>Party</Text>
                        <Text style={styles.cellValue} numberOfLines={1}>
                          {invoice.party}
                        </Text>
                      </View>
                      <View style={styles.invoiceCell}>
                        <Text style={styles.cellLabel}>Amount</Text>
                        <Text style={styles.cellValue}>
                          {invoice.amountLabel}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.invoiceActions}>
                      <Pressable
                        style={styles.actionIconBtn}
                        onPress={() => onOpenDetails(invoice)}
                        accessibilityLabel="View invoice">
                        <Icon
                          name="roleEye"
                          size={14}
                          color={colors.textSoft}
                        />
                      </Pressable>
                      <Pressable
                        style={styles.actionIconBtn}
                        onPress={() => onOpenShare(invoice)}
                        accessibilityLabel="Send invoice">
                        <Icon
                          name="sendPlane"
                          size={14}
                          color={colors.textSoft}
                        />
                      </Pressable>
                      <Pressable
                        style={styles.actionIconBtn}
                        onPress={() => onDownloadPress(invoice)}
                        accessibilityLabel="Download invoice">
                        <Icon
                          name="download"
                          size={14}
                          color={colors.textSoft}
                        />
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <LedgerCreateInvoiceModal
        visible={isCreateVisible}
        form={createForm}
        totalLabel={createTotalLabel}
        onClose={onCloseCreate}
        onConfirm={onConfirmCreate}
        updateField={updateCreateField}
        updateLineItem={updateLineItem}
        onAddLineRow={onAddLineRow}
        onRemoveLineRow={onRemoveLineRow}
      />
      <InvoiceDetailsModal
        visible={isDetailsVisible}
        invoice={selectedInvoice}
        onClose={onCloseDetails}
        onDownload={() =>
          selectedInvoice ? onDownloadPress(selectedInvoice) : undefined
        }
        onShare={() => onOpenShare()}
      />
      <ShareInvoiceModal
        visible={isShareVisible}
        invoice={selectedInvoice}
        email={shareEmail}
        message={shareMessage}
        onChangeEmail={setShareEmail}
        onChangeMessage={setShareMessage}
        onClose={onCloseShare}
        onCopyLink={onCopyLink}
        onQuickShare={onQuickShare}
        onSend={onSendShare}
      />
    </Screen>
  );
}
