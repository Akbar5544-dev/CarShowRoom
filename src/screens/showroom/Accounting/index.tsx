import React, {useMemo} from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, {Line, Path, Rect, Text as SvgText} from 'react-native-svg';
import {Icon, MetricCard, Screen} from '../../../components';
import {useThemedStyles, useThemeColors} from '../../../theme';
import type {ProfitLossPoint} from './module';
import {createStyles} from './styles';
import {useAccountingController} from './useController';

function ProfitLossChart({
  data,
  width,
  incomeColor,
  expenseColor,
  axisColor,
}: {
  data: ProfitLossPoint[];
  width: number;
  incomeColor: string;
  expenseColor: string;
  axisColor: string;
}) {
  const height = 180;
  const padLeft = 28;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 24;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const max = Math.max(
    100,
    ...data.flatMap(item => [item.income, item.expense]),
  );
  const groupW = chartW / Math.max(data.length, 1);
  const barW = Math.max(4, groupW * 0.28);
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <Svg width={width} height={height}>
      {yTicks.map(tick => {
        const y = padTop + chartH - (tick / 100) * chartH;
        return (
          <React.Fragment key={tick}>
            <Line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke={axisColor}
              strokeWidth={0.75}
              opacity={0.35}
            />
            <SvgText
              x={padLeft - 6}
              y={y + 3}
              fill={axisColor}
              fontSize={9}
              textAnchor="end">
              {tick}
            </SvgText>
          </React.Fragment>
        );
      })}
      {data.map((item, index) => {
        const cx = padLeft + index * groupW + groupW / 2;
        const incomeH = (item.income / max) * chartH;
        const expenseH = (item.expense / max) * chartH;
        return (
          <React.Fragment key={item.label}>
            <Rect
              x={cx - barW - 1.5}
              y={padTop + chartH - incomeH}
              width={barW}
              height={incomeH}
              rx={3}
              fill={incomeColor}
            />
            <Rect
              x={cx + 1.5}
              y={padTop + chartH - expenseH}
              width={barW}
              height={expenseH}
              rx={3}
              fill={expenseColor}
            />
            <SvgText
              x={cx}
              y={height - 6}
              fill={axisColor}
              fontSize={9}
              textAnchor="middle">
              {item.label}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function CashFlowChart({
  values,
  width,
  lineColor,
  fillColor,
  axisColor,
}: {
  values: number[];
  width: number;
  lineColor: string;
  fillColor: string;
  axisColor: string;
}) {
  const height = 160;
  const padLeft = 28;
  const padRight = 8;
  const padTop = 10;
  const padBottom = 22;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const max = Math.max(...values, 6);
  const min = 0;
  const range = max - min || 1;
  const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const yTicks = [0, 1.5, 3, 4.5, 6];

  const points = useMemo(() => {
    if (!values.length) {
      return [];
    }
    const step = chartW / Math.max(values.length - 1, 1);
    return values.map((value, index) => ({
      x: padLeft + index * step,
      y: padTop + chartH - ((value - min) / range) * chartH,
    }));
  }, [chartH, chartW, range, values]);

  const linePath = points
    .map((point, index) => {
      if (index === 0) {
        return `M${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      }
      const prev = points[index - 1];
      const cpx = (prev.x + point.x) / 2;
      return `C${cpx.toFixed(1)} ${prev.y.toFixed(1)} ${cpx.toFixed(1)} ${point.y.toFixed(1)} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    })
    .join(' ');

  const areaPath = points.length
    ? `${linePath} L${points[points.length - 1].x.toFixed(1)} ${(padTop + chartH).toFixed(1)} L${points[0].x.toFixed(1)} ${(padTop + chartH).toFixed(1)} Z`
    : '';

  return (
    <Svg width={width} height={height}>
      {yTicks.map(tick => {
        const y = padTop + chartH - (tick / 6) * chartH;
        return (
          <React.Fragment key={tick}>
            <Line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke={axisColor}
              strokeWidth={0.75}
              opacity={0.3}
            />
            <SvgText
              x={padLeft - 6}
              y={y + 3}
              fill={axisColor}
              fontSize={9}
              textAnchor="end">
              {tick}
            </SvgText>
          </React.Fragment>
        );
      })}
      {areaPath ? <Path d={areaPath} fill={fillColor} /> : null}
      {linePath ? (
        <Path
          d={linePath}
          stroke={lineColor}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {labels.map((label, index) => {
        const x =
          padLeft + (index / Math.max(labels.length - 1, 1)) * chartW;
        return (
          <SvgText
            key={`${label}-${index}`}
            x={x}
            y={height - 4}
            fill={axisColor}
            fontSize={9}
            textAnchor="middle">
            {label}
          </SvgText>
        );
      })}
    </Svg>
  );
}

export function Accounting() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {width} = useWindowDimensions();
  const {
    subtitle,
    metrics,
    profitLoss,
    expenseBreakdown,
    cashFlow,
    cashFlowPositive,
    onBackPress,
    onExportPress,
    onInvoicePress,
  } = useAccountingController();

  const chartWidth = Math.min(width - 72, 520);

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
                <Text style={styles.pageTitle}>Financial Dashboard</Text>
                <Text style={styles.pageSubtitle}>{subtitle}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.secondaryBtn} onPress={onExportPress}>
                <Icon name="download" size={12} color={colors.textDark} />
                <Text style={styles.secondaryBtnText}>Export</Text>
              </Pressable>
              <Pressable style={styles.primaryBtn} onPress={onInvoicePress}>
                <Icon name="documentFile" size={12} color={colors.white} />
                <Text style={styles.primaryBtnText}>Invoice</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            {metrics.map(item => (
              <MetricCard key={item.id} item={item} />
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>Profit & Loss</Text>
              <Text style={styles.sectionTitle}>Income vs Expenses</Text>
            </View>
            <View style={styles.chartWrap}>
              <ProfitLossChart
                data={profitLoss}
                width={chartWidth}
                incomeColor={colors.actionBlue}
                expenseColor={colors.late}
                axisColor={colors.textSoft}
              />
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, {backgroundColor: colors.actionBlue}]}
                />
                <Text style={styles.legendText}>income</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, {backgroundColor: colors.late}]}
                />
                <Text style={styles.legendText}>expense</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>Expense Breakdown</Text>
              <Text style={styles.sectionTitle}>This Month</Text>
            </View>
            <View style={styles.expenseList}>
              {expenseBreakdown.map(item => (
                <View key={item.id} style={styles.expenseRow}>
                  <View style={styles.expenseTop}>
                    <Text style={styles.expenseLabel}>{item.label}</Text>
                    <Text style={styles.expenseAmount}>{item.amount}</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {width: `${Math.round(item.progress * 100)}%`},
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEyebrow}>Cash Flow</Text>
                <Text style={styles.sectionTitle}>Monthly balance</Text>
              </View>
              <View style={styles.positiveBadge}>
                <Icon name="growthGreen" size={9} />
                <Text style={styles.positiveBadgeText}>
                  {cashFlowPositive ? 'Positive' : 'Watch'}
                </Text>
              </View>
            </View>
            <View style={styles.chartWrap}>
              <CashFlowChart
                values={cashFlow}
                width={chartWidth}
                lineColor={colors.actionBlue}
                fillColor={colors.actionTint15}
                axisColor={colors.textSoft}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
