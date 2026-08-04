import React, {useCallback, useMemo, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon, Screen} from '../../../components';
import {FeedPostCard} from '../CustomerHome/FeedPostCard';
import type {FeedPost} from '../CustomerHome/module';
import {C} from './tokens';

export type CollectionChip =
  | 'All'
  | 'Cars'
  | 'Showrooms'
  | 'For Sale'
  | 'For Rent';

export const COLLECTION_CHIPS: CollectionChip[] = [
  'All',
  'Cars',
  'Showrooms',
  'For Sale',
  'For Rent',
];

type Props = {
  title: string;
  initialPosts: FeedPost[];
  /** When unsave happens on Saved screen, remove the card */
  removeOnUnsave?: boolean;
};

export function PostCollectionScreen({
  title,
  initialPosts,
  removeOnUnsave = false,
}: Props) {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const compact = width < 360;
  const [chip, setChip] = useState<CollectionChip>('All');
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);

  const filtered = useMemo(() => {
    return posts.filter(post => {
      if (chip === 'Cars' && post.category !== 'Cars') return false;
      if (chip === 'Showrooms' && post.category !== 'Showrooms') return false;
      if (chip === 'For Sale' && post.listingType !== 'For Sale') return false;
      if (chip === 'For Rent' && post.listingType !== 'For Rent') return false;
      return true;
    });
  }, [chip, posts]);

  const onToggleLike = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;
        const liked = !post.liked;
        return {
          ...post,
          liked,
          likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      }),
    );
  }, []);

  const onToggleSave = useCallback(
    (postId: string) => {
      setPosts(prev => {
        const next = prev.map(post =>
          post.id === postId ? {...post, saved: !post.saved} : post,
        );
        if (removeOnUnsave) {
          return next.filter(post => post.saved);
        }
        return next;
      });
    },
    [removeOnUnsave],
  );

  const onShare = useCallback(async (post: FeedPost) => {
    try {
      await Share.share({
        message: `${post.title}\n${post.description}\n— ${post.sellerName}`,
      });
      setPosts(prev =>
        prev.map(item =>
          item.id === post.id ? {...item, shared: true} : item,
        ),
      );
    } catch {
      // cancelled
    }
  }, []);

  const renderItem = useCallback<ListRenderItem<FeedPost>>(
    ({item}) => (
      <FeedPostCard
        post={item}
        onToggleLike={onToggleLike}
        onToggleSave={onToggleSave}
        onShare={onShare}
      />
    ),
    [onShare, onToggleLike, onToggleSave],
  );

  return (
    <Screen style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topbar}>
        <Pressable
          style={styles.backBtn}
          accessibilityLabel="Back"
          onPress={() => navigation.goBack()}>
          <Icon name="chevronLeft" size={16} color={C.text} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.filtersRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[
            styles.chipsContent,
            {
              gap: compact ? 6 : 8,
              paddingHorizontal: Math.max(12, Math.round(width * 0.035)),
            },
          ]}>
          {COLLECTION_CHIPS.map(item => {
            const on = chip === item;
            return (
              <Pressable
                key={item}
                style={[
                  styles.fchip,
                  {
                    flexShrink: 0,
                    paddingHorizontal: compact ? 10 : 13,
                    paddingVertical: compact ? 5 : 6,
                  },
                  on && styles.fchipOn,
                ]}
                onPress={() => setChip(item)}
                hitSlop={4}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.fchipText,
                    {fontSize: compact ? 10 : 11},
                    on && styles.fchipTextOn,
                  ]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No cars available</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: C.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
  },
  filtersRow: {
    backgroundColor: C.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    paddingVertical: 8,
  },
  chipsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fchip: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  fchipOn: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  fchipText: {
    fontWeight: '500',
    color: C.muted,
  },
  fchipTextOn: {
    color: C.white,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 12,
    flexGrow: 1,
  },
  empty: {
    paddingTop: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },
});
