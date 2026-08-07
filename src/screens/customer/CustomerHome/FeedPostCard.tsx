import React, {memo} from 'react';
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Icon} from '../../../components';
import {useThemedStyles} from '../../../theme';
import type {FeedPost} from './module';
import {FEED_LIKE, FEED_MUTED, FEED_PRIMARY} from './module';
import {createPostStyles} from './styles';

type FeedPostCardProps = {
  post: FeedPost;
  onPress?: (post: FeedPost) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onShare: (post: FeedPost) => void;
};

export const FeedPostCard = memo(function FeedPostCard({
  post,
  onPress,
  onToggleLike,
  onToggleSave,
  onShare,
}: FeedPostCardProps) {
  const styles = useThemedStyles(createPostStyles);
  const {width} = useWindowDimensions();
  const imageHeight = Math.round(Math.min(200, Math.max(130, width * 0.36)));

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(post)}>
      <View style={styles.head}>
        <View style={styles.uploader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{post.sellerInitials}</Text>
          </View>
          <View style={styles.uploaderMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {post.sellerName}
              </Text>
              {post.verified ? (
                <Icon name="verifiedCheck" size={12} color={FEED_PRIMARY} />
              ) : null}
            </View>
            <Text style={styles.meta}>{post.postedAgo}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.image, {height: imageHeight}]}>
        {post.imageUri ? (
          <Image
            source={{uri: post.imageUri}}
            style={styles.imageMedia}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.imagePlaceholder}>{post.title}</Text>
        )}
        <View
          style={[
            styles.listingBadge,
            post.listingType === 'For Rent'
              ? styles.listingBadgeRent
              : styles.listingBadgeSale,
          ]}>
          <Text
            style={[
              styles.listingBadgeText,
              post.listingType === 'For Rent'
                ? styles.listingBadgeTextRent
                : styles.listingBadgeTextSale,
            ]}>
            {post.listingType}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.action}>
          <Icon name="eye" size={14} color={FEED_MUTED} />
          <Text style={styles.actionText}>{post.viewsLabel}</Text>
        </View>

        <Pressable
          style={styles.action}
          hitSlop={8}
          onPress={() => onToggleLike(post.id)}>
          <Icon
            name={post.liked ? 'heartFill' : 'heart'}
            size={14}
            color={post.liked ? FEED_LIKE : FEED_MUTED}
          />
          <Text
            style={[
              styles.actionText,
              post.liked ? styles.actionLikeText : null,
            ]}>
            {post.likes}
          </Text>
        </Pressable>

        <Pressable
          style={styles.action}
          hitSlop={8}
          onPress={() => onShare(post)}>
          <Icon
            name="shareUpload"
            size={14}
            color={post.shared ? FEED_PRIMARY : FEED_MUTED}
          />
          <Text
            style={[
              styles.actionText,
              post.shared ? styles.actionSavedText : null,
            ]}>
            {post.shared ? 'Shared' : 'Share'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.action}
          hitSlop={8}
          onPress={() => onToggleSave(post.id)}>
          <Icon
            name={post.saved ? 'bookmarkFill' : 'bookmark'}
            size={14}
            color={post.saved ? FEED_PRIMARY : FEED_MUTED}
          />
          <Text
            style={[
              styles.actionText,
              post.saved ? styles.actionSavedText : null,
            ]}>
            {post.saved ? 'Saved' : 'Save'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
});
