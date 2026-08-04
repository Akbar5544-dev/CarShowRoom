import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Screen} from '../../../components';
import {useThemedStyles} from '../../../theme';
import type {CustomerHomeStackParamList} from '../../../navigation/types';
import {
  AVATAR_COLORS,
  FEED_MUTED,
  FEED_PRIMARY,
  threadForConversation,
  type ChatMessage,
} from './module';
import {createConversationStyles} from './conversationStyles';

type Route = RouteProp<CustomerHomeStackParamList, 'CustomerConversation'>;

export function CustomerConversation() {
  const styles = useThemedStyles(createConversationStyles);
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const {
    conversationId,
    name,
    initials,
    tone,
    online,
    verified,
  } = route.params;

  const seed = useMemo(
    () => threadForConversation(conversationId),
    [conversationId],
  );
  const [messages, setMessages] = useState<ChatMessage[]>(seed);
  const [draft, setDraft] = useState('');
  const [from] = AVATAR_COLORS[tone];

  const onSend = useCallback(() => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    setMessages(prev => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        kind: 'text',
        from: 'me',
        text,
        time,
      },
    ]);
    setDraft('');
  }, [draft]);

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topbar}>
        <Pressable
          style={styles.backBtn}
          accessibilityLabel="Back"
          onPress={() => navigation.goBack()}>
          <Icon name="chevronLeft" size={16} color="#111827" />
        </Pressable>
        <View style={styles.user}>
          <View style={[styles.avatar, {backgroundColor: from}]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              {verified ? (
                <Icon name="verifiedCheck" size={12} color={FEED_PRIMARY} />
              ) : null}
            </View>
            <Text style={styles.status}>{online ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
        <Pressable style={styles.callBtn} accessibilityLabel="Call">
          <Icon name="phoneOutline" size={16} color={FEED_PRIMARY} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            if (item.kind === 'day') {
              return (
                <View style={styles.day}>
                  <Text style={styles.dayText}>{item.label}</Text>
                </View>
              );
            }
            if (item.kind === 'listing') {
              return (
                <View style={styles.listing}>
                  <View style={styles.listingImage}>
                    <Text style={styles.listingImageText} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle}>{item.title}</Text>
                    <Text style={styles.listingSub}>{item.subtitle}</Text>
                    <Text style={styles.listingPrice}>{item.price}</Text>
                  </View>
                </View>
              );
            }
            if (item.kind === 'voice') {
              const mine = item.from === 'me';
              return (
                <View
                  style={[
                    styles.bubble,
                    styles.voiceBubble,
                    mine ? styles.bubbleMe : styles.bubbleThem,
                  ]}>
                  <View
                    style={[
                      styles.voicePlay,
                      mine && styles.voicePlayMe,
                    ]}>
                    <Icon
                      name="playFill"
                      size={12}
                      color={mine ? FEED_PRIMARY : '#fff'}
                    />
                  </View>
                  <View style={styles.voiceWave}>
                    {[8, 14, 10, 18, 12, 16, 9, 14].map((h, i) => (
                      <View
                        key={i}
                        style={[
                          styles.waveBar,
                          {
                            height: h,
                            backgroundColor: mine
                              ? 'rgba(255,255,255,0.85)'
                              : '#94a3b8',
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.voiceDur,
                      mine && styles.voiceDurMe,
                    ]}>
                    {item.duration}
                  </Text>
                  <Text style={[styles.time, mine && styles.timeMe]}>
                    {item.time}
                  </Text>
                </View>
              );
            }

            const mine = item.from === 'me';
            return (
              <View
                style={[
                  styles.bubble,
                  mine ? styles.bubbleMe : styles.bubbleThem,
                ]}>
                <Text style={[styles.bubbleText, mine && styles.bubbleTextMe]}>
                  {item.text}
                </Text>
                <Text style={[styles.time, mine && styles.timeMe]}>
                  {item.time}
                </Text>
              </View>
            );
          }}
        />

        <View
          style={[
            styles.composer,
            {paddingBottom: Math.max(insets.bottom, 12)},
          ]}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Type a message..."
              placeholderTextColor={FEED_MUTED}
              multiline
            />
          </View>
          <Pressable style={styles.micBtn} accessibilityLabel="Voice message">
            <Icon name="mic" size={18} color="#374151" />
          </Pressable>
          <Pressable
            style={styles.sendBtn}
            accessibilityLabel="Send"
            onPress={onSend}>
            <Icon name="shareUpload" size={16} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
