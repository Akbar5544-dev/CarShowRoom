import React from 'react';
import {Image, Pressable, ScrollView, Text, View} from 'react-native';
import {Images, type IconName} from '../../../assets';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors, colors} from '../../../theme';
import type {ReviewTabId, SkillBar} from './module';
import {createStyles} from './styles';
import {useReviewApplicationController} from './useController';

function StarRow({
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.stars}>
      {Array.from({length: 5}).map((_, index) => {
        const starValue = index + 1;
        return (
          <Pressable
            key={starValue}
            style={styles.starBtn}
            onPress={() => onChange(starValue)}
            accessibilityLabel={`Rate ${starValue} stars`}>
            <Icon name="starOutline" size={20} color={colors.actionBlue} />
          </Pressable>
        );
      })}
    </View>
  );
}

function SkillBarRow({skill}: {skill: SkillBar}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.skillRow}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillLabel}>{skill.label}</Text>
        <Text style={styles.skillPercent}>{skill.percent}%</Text>
      </View>
      <View style={styles.skillTrack}>
        <View style={[styles.skillFill, {width: `${skill.percent}%`}]} />
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  text,
}: {
  icon: IconName;
  text: string;
}) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.detailRow}>
      <Icon name={icon} size={13} color={colors.actionBlue} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

function ReviewTabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: {id: ReviewTabId; label: string}[];
  activeTab: ReviewTabId;
  onChange: (tab: ReviewTabId) => void;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.tabsWrap}>
      {tabs.map(tab => {
        const active = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[styles.tab, active && styles.tabActive]}>
            <Text
              style={[styles.tabLabel, active && styles.tabLabelActive]}
              numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ReviewApplication() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    subtitle,
    profile,
    tabs,
    activeTab,
    skills,
    experienceTitle,
    experienceSubtitle,
    screening,
    feedbackCriteria,
    feedbackScores,
    setActiveTab,
    setFeedbackScore,
    onBackPress,
    onCvPress,
    onSharePress,
    onMoveToInterviewPress,
    onShortlistPress,
    onRejectPress,
    onDownloadPdfPress,
  } = useReviewApplicationController();

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
              <View style={styles.titleBlock}>
                <Text style={styles.pageTitle}>Review Application</Text>
                <Text style={styles.pageSubtitle}>{subtitle}</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatarWrap}>
                <Image
                  source={Images.profileAvatar}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileRole}>{profile.role}</Text>
              <View style={styles.matchBadge}>
                <Icon name="star" size={11} color={colors.actionBlue} />
                <Text style={styles.matchText}>
                  {profile.matchPercent}% match
                </Text>
              </View>
            </View>

            <View style={styles.detailsList}>
              <DetailRow icon="email" text={profile.email} />
              <DetailRow icon="phone" text={profile.phone} />
              <DetailRow icon="location" text={profile.location} />
              <DetailRow icon="briefcase" text={profile.experience} />
              <DetailRow icon="graduationCap" text={profile.education} />
              <DetailRow icon="calendarField" text={profile.appliedDate} />
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.outlineBtn} onPress={onCvPress}>
                <Icon name="download" size={13} color={colors.textDark} />
                <Text style={styles.outlineBtnText}>CV</Text>
              </Pressable>
              <Pressable style={styles.outlineBtn} onPress={onSharePress}>
                <Icon name="shareNodes" size={13} color={colors.textDark} />
                <Text style={styles.outlineBtnText}>Share</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.decisionCard}>
            <Text style={styles.sectionLabel}>Decision</Text>
            <View style={styles.decisionList}>
              <Pressable
                style={styles.primaryBtn}
                onPress={onMoveToInterviewPress}>
                <Icon name="checkCircle" size={14} color={colors.white} />
                <Text style={styles.primaryBtnText}>Move to Interview</Text>
              </Pressable>
              <Pressable style={styles.secondaryBtn} onPress={onShortlistPress}>
                <Text style={styles.secondaryBtnText}>Shortlist</Text>
              </Pressable>
              <Pressable style={styles.rejectBtn} onPress={onRejectPress}>
                <Icon name="rejectCircle" size={14} color={colors.absent} />
                <Text style={styles.rejectBtnText}>Reject</Text>
              </Pressable>
            </View>
          </View>

          <ReviewTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'profile' ? (
            <View style={styles.panel}>
              <View style={styles.summaryHeader}>
                <Text style={styles.sectionLabel}>Summary</Text>
                <Text style={styles.aboutTitle}>About</Text>
              </View>
              <Text style={styles.aboutText}>{profile.about}</Text>
              <View style={styles.skillsList}>
                {skills.map(skill => (
                  <SkillBarRow key={skill.id} skill={skill} />
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'resume' ? (
            <View style={styles.panel}>
              <View style={styles.resumeHeader}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.sectionLabel}>CV preview</Text>
                  <Text style={styles.aboutTitle}>Resume</Text>
                </View>
                <Pressable
                  style={styles.downloadOutlineBtn}
                  onPress={onDownloadPdfPress}>
                  <Text style={styles.downloadOutlineBtnText}>
                    Download PDF
                  </Text>
                </Pressable>
              </View>
              <View style={styles.resumePreviewBox}>
                <Text style={styles.resumeRole}>{experienceTitle}</Text>
                <Text style={styles.resumeMeta}>{experienceSubtitle}</Text>
              </View>
            </View>
          ) : null}

          {activeTab === 'screening' ? (
            <View style={styles.panel}>
              <View style={styles.summaryHeader}>
                <Text style={styles.sectionLabel}>Questionnaire</Text>
                <Text style={styles.aboutTitle}>Screening answers</Text>
              </View>
              <View style={styles.screeningList}>
                {screening.map(item => (
                  <View key={item.id} style={styles.qaBlock}>
                    <Text style={styles.qaQuestion}>{item.question}</Text>
                    <Text style={styles.qaAnswer}>{item.answer}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'notes' ? (
            <View style={styles.panel}>
              <View style={styles.summaryHeader}>
                <Text style={styles.sectionLabel}>Team feedback</Text>
                <Text style={styles.aboutTitle}>Internal notes & scorecard</Text>
              </View>
              <View style={styles.scoreList}>
                {feedbackCriteria.map(criterion => (
                  <View key={criterion.id} style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>{criterion.label}</Text>
                    <StarRow
                      value={feedbackScores[criterion.id] ?? 0}
                      onChange={value => setFeedbackScore(criterion.id, value)}
                    />
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
