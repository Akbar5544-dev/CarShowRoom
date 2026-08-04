import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Icon, Screen} from '../../../components';
import {useThemedStyles} from '../../../theme';
import type {CustomerHomeStackParamList} from '../../../navigation/types';
import {
  AVATAR_COLORS,
  CONVERSATIONS,
  FEED_MUTED,
  FEED_PRIMARY,
  type ConversationPreview,
} from './module';
import {createStyles} from './styles';

type Nav = NativeStackNavigationProp<
  CustomerHomeStackParamList,
  'CustomerMessages'
>;

function Avatar({item}: {item: ConversationPreview}) {
  const styles = useThemedStyles(createStyles);
  const [from] = AVATAR_COLORS[item.tone];
  return (
    <View style={[styles.avatar, {backgroundColor: from}]}>
      <Text style={styles.avatarText}>{item.initials}</Text>
      {item.online ? <View style={styles.onlineDot} /> : null}
    </View>
  );
}

export function CustomerMessages() {
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return CONVERSATIONS;
    }
    return CONVERSATIONS.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.preview.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topbar}>
        <Pressable
          style={styles.backBtn}
          accessibilityLabel="Back"
          onPress={() => navigation.goBack()}>
          <Icon name="chevronLeft" size={16} color="#111827" />
        </Pressable>
        <Text style={styles.title}>Messages</Text>
        <Pressable style={styles.newBtn} accessibilityLabel="New message">
          <Icon name="addPlus" size={16} color={FEED_PRIMARY} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Icon name="search" size={14} color={FEED_MUTED} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search messages..."
            placeholderTextColor={FEED_MUTED}
            returnKeyType="search"
          />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        }
        renderItem={({item}) => (
          <Pressable
            style={[styles.item, item.unread > 0 && styles.itemUnread]}
            onPress={() =>
              navigation.navigate('CustomerConversation', {
                conversationId: item.id,
                name: item.name,
                initials: item.initials,
                tone: item.tone,
                online: item.online ?? false,
                verified: item.verified ?? false,
              })
            }>
            <Avatar item={item} />
            <View style={styles.body}>
              <View style={styles.row}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.preview,
                    item.unread > 0 && styles.previewUnread,
                  ]}
                  numberOfLines={1}>
                  {item.preview}
                </Text>
                {item.unread > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unread}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}
