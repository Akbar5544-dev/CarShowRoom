import React from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Screen} from '../../../components';
import {useThemedStyles, useThemeColors, colors} from '../../../theme';
import type {LiveParticipant} from './module';
import {createStyles} from './styles';
import {useLiveInterviewController} from './useController';

function StarRow({
  value,
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
        const filled = starValue <= value;
        return (
          <Pressable
            key={starValue}
            style={styles.starBtn}
            onPress={() => onChange(starValue)}
            accessibilityLabel={`Rate ${starValue} stars`}>
            <Icon
              name="star"
              size={15}
              color={filled ? colors.actionBlue : colors.border}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

function VideoTile({participant}: {participant: LiveParticipant}) {
  const styles = useThemedStyles(createStyles);

  const bg = participant.isMono ? '#4B5563' : participant.color;

  return (
    <View
      style={[
        styles.videoTile,
        {backgroundColor: bg},
        participant.isActive && styles.videoTileActive,
      ]}>
      <View style={styles.videoInitials}>
        <Text style={styles.videoInitialsText}>{participant.initials}</Text>
      </View>
      <View style={styles.videoOverlay}>
        <Text style={styles.videoName}>{participant.name}</Text>
        <Text style={styles.videoRole}>{participant.role}</Text>
      </View>
      {participant.isActive ? (
        <View style={styles.micBadge}>
          <Icon name="micOn" size={11} />
        </View>
      ) : null}
      {participant.isYou ? (
        <View style={styles.youBadge}>
          <Text style={styles.youBadgeText}>You</Text>
        </View>
      ) : null}
    </View>
  );
}

export function LiveInterview() {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const {
    eyebrow,
    title,
    recordingLabel,
    participants,
    callControls,
    scorecard,
    scores,
    notes,
    chatMessages,
    chatInput,
    setScore,
    setNotes,
    setChatInput,
    onSendMessage,
    onBackPress,
    onEndCallPress,
  } = useLiveInterviewController();

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={28}>
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
                <Text style={styles.eyebrow}>{eyebrow}</Text>
                <Text style={styles.pageTitle}>{title}</Text>
              </View>
            </View>

            <View style={styles.recordingRow}>
              <View style={styles.recordingBadge}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>{recordingLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.callCard}>
            <View style={styles.videoGrid}>
              {participants.map(participant => (
                <VideoTile key={participant.id} participant={participant} />
              ))}
            </View>

            <View style={styles.controlsBar}>
              <View style={styles.controlsGroup}>
                {callControls.map(control => (
                  <Pressable
                    key={control.id}
                    style={styles.controlBtn}
                    accessibilityLabel={control.label}
                    hitSlop={4}>
                    <Icon
                      name={control.icon}
                      size={14}
                      color={colors.textDark}
                    />
                  </Pressable>
                ))}
              </View>
              <Pressable
                style={styles.endCallBtn}
                onPress={onEndCallPress}
                accessibilityLabel="End call">
                <Icon name="endCall" size={13} />
                <Text style={styles.endCallText}>End call</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEyebrow}>Live scorecard</Text>
              <Icon name="documentFile" size={14} color={colors.textSoft} />
            </View>
            <View style={styles.scoreRows}>
              {scorecard.map(criterion => (
                <View key={criterion.id} style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>{criterion.label}</Text>
                  <StarRow
                    value={scores[criterion.id] ?? 0}
                    onChange={value => setScore(criterion.id, value)}
                  />
                </View>
              ))}
            </View>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Live notes..."
              placeholderTextColor={colors.textSoft}
              multiline
              style={styles.notesInput}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>Chat</Text>
            <View style={styles.chatList}>
              {chatMessages.map(message => (
                <View
                  key={message.id}
                  style={[
                    styles.chatBubble,
                    message.isYou && styles.chatBubbleYou,
                  ]}>
                  <Text style={styles.chatText}>
                    <Text style={styles.chatSender}>{message.sender}: </Text>
                    {message.text}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.chatInputWrap}>
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Type a message..."
                placeholderTextColor={colors.textSoft}
                style={styles.chatInput}
                onSubmitEditing={onSendMessage}
                returnKeyType="send"
              />
              <Pressable
                style={styles.sendBtn}
                onPress={onSendMessage}
                accessibilityLabel="Send message">
                <Icon name="sendPlane" size={13} />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
