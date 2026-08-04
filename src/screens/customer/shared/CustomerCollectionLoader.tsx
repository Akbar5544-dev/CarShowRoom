import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage, getAuthToken} from '../../../api';
import {
  publicSiteFeedService,
  publicSiteSavedVehiclesService,
} from '../../../services';
import {mapPublicFeedList} from '../../../utils/publicFeed';
import type {FeedPost} from '../CustomerHome/module';
import {PostCollectionScreen} from './PostCollectionScreen';
import {C} from './tokens';

type Mode = 'saved' | 'liked' | 'shared';

type Props = {
  mode: Mode;
  title: string;
};

async function fetchCollection(mode: Mode): Promise<FeedPost[]> {
  if (mode === 'saved') {
    const res = await publicSiteSavedVehiclesService.listPublicSavedVehicles({
      per_page: 50,
    });
    return mapPublicFeedList(res);
  }
  if (mode === 'liked') {
    const res = await publicSiteFeedService.likedVehicles({per_page: 50});
    return mapPublicFeedList(res);
  }
  const res = await publicSiteFeedService.sharedVehicles({per_page: 50});
  return mapPublicFeedList(res);
}

export function CustomerCollectionLoader({mode, title}: Props) {
  const [posts, setPosts] = useState<FeedPost[] | null>(null);

  const load = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        showMessage({
          message: 'Please log in again to view this list',
          type: 'warning',
        });
        setPosts([]);
        return;
      }
      const list = await fetchCollection(mode);
      setPosts(list);
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, `Failed to load ${title}`),
        type: 'danger',
      });
      setPosts([]);
    }
  }, [mode, title]);

  useEffect(() => {
    load();
  }, [load]);

  if (posts == null) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: C.bg,
        }}>
        <ActivityIndicator color={C.primary} />
        <Text style={{marginTop: 10, color: C.muted, fontSize: 12}}>
          Loading {title}…
        </Text>
      </View>
    );
  }

  return (
    <PostCollectionScreen
      title={title}
      initialPosts={posts}
      removeOnUnsave={mode === 'saved'}
    />
  );
}
