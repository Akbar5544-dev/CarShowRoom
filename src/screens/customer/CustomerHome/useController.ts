import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {clearAuthSession, getApiErrorMessage} from '../../../api';
import {
  authService,
  publicSiteAuthService,
  publicSiteFeedService,
  publicSiteSavedVehiclesService,
} from '../../../services';
import {clearSession} from '../../../store/appSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import type {CustomerHomeStackParamList} from '../../../navigation/types';
import {mapPublicFeedList} from '../../../utils/publicFeed';
import type {
  ActiveFilterChip,
  CustomerHomeController,
  FeedChipId,
  FeedPost,
  SheetFilters,
  SidebarItemId,
} from './module';
import {DEFAULT_SHEET_FILTERS} from './module';

function hasPriceConstraint(filters: SheetFilters): boolean {
  return Boolean(
    filters.pricePreset || filters.priceMin.trim() || filters.priceMax.trim(),
  );
}

function matchesPrice(post: FeedPost, filters: SheetFilters): boolean {
  if (!hasPriceConstraint(filters)) {
    return true;
  }

  // Price (Lakh) filter applies to sale listings only
  if (post.priceLakh == null) {
    return false;
  }

  const value = post.priceLakh;
  if (filters.pricePreset === 'Under 30L') {
    return value < 30;
  }
  if (filters.pricePreset === '20–100L') {
    return value >= 20 && value <= 100;
  }
  if (filters.pricePreset === '100L+') {
    return value >= 100;
  }

  const min = filters.priceMin.trim() ? Number(filters.priceMin) : null;
  const max = filters.priceMax.trim() ? Number(filters.priceMax) : null;
  if (min != null && !Number.isNaN(min) && value < min) {
    return false;
  }
  if (max != null && !Number.isNaN(max) && value > max) {
    return false;
  }
  return true;
}

function buildActiveFilters(filters: SheetFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  if (filters.pricePreset) {
    chips.push({key: 'price', label: filters.pricePreset});
  } else if (filters.priceMin || filters.priceMax) {
    chips.push({
      key: 'price',
      label: `${filters.priceMin || '0'}–${filters.priceMax || '∞'}L`,
    });
  }
  if (filters.city) {
    chips.push({key: 'city', label: filters.city});
  }
  if (filters.make) {
    chips.push({key: 'make', label: filters.make});
  }
  return chips;
}

export function filterFeedPosts(
  posts: FeedPost[],
  options: {
    chip: FeedChipId;
    filters: SheetFilters;
    search: string;
  },
): FeedPost[] {
  const query = options.search.trim().toLowerCase();
  let list = posts.filter(post => {
    if (options.chip === 'For Sale' && post.listingType !== 'For Sale') {
      return false;
    }
    if (options.chip === 'For Rent' && post.listingType !== 'For Rent') {
      return false;
    }
    if (options.chip === 'Trending' && !post.trending) {
      return false;
    }
    if (options.chip === 'New' && !post.isNew) {
      return false;
    }

    if (options.filters.type !== 'All' && post.listingType !== options.filters.type) {
      return false;
    }
    if (options.filters.city && post.city !== options.filters.city) {
      return false;
    }
    if (options.filters.make && post.make !== options.filters.make) {
      return false;
    }
    if (!matchesPrice(post, options.filters)) {
      return false;
    }

    if (query) {
      const haystack =
        `${post.title} ${post.description} ${post.sellerName} ${post.make}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    return true;
  });

  if (options.filters.sort === 'Popular') {
    list = [...list].sort((a, b) => b.likes - a.likes);
  } else if (options.filters.sort === 'Price ↑') {
    list = [...list].sort((a, b) => {
      const av = a.priceLakh ?? Number.POSITIVE_INFINITY;
      const bv = b.priceLakh ?? Number.POSITIVE_INFINITY;
      return av - bv;
    });
  }

  return list;
}

function chipForFilterType(
  type: SheetFilters['type'],
  fallback: FeedChipId,
): FeedChipId {
  if (type === 'For Sale' || type === 'For Rent') {
    return type;
  }
  if (fallback === 'For Sale' || fallback === 'For Rent') {
    return 'All';
  }
  return fallback;
}

export function useCustomerHomeController(): CustomerHomeController {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<CustomerHomeStackParamList, 'CustomerHomeMain'>
    >();
  const userName = useAppSelector(state => state.app.userName);
  const userEmail = useAppSelector(state => {
    const email = state.app.user?.email;
    return typeof email === 'string' && email.trim()
      ? email
      : 'ali@email.com';
  });
  const [search, setSearch] = useState('');
  const [activeChip, setActiveChip] = useState<FeedChipId>('All');
  const [postsState, setPostsState] = useState<FeedPost[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<SheetFilters>(
    DEFAULT_SHEET_FILTERS,
  );
  const [draftFilters, setDraftFilters] = useState<SheetFilters>(
    DEFAULT_SHEET_FILTERS,
  );
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarActiveItem, setSidebarActiveItem] =
    useState<Exclude<SidebarItemId, 'logout'>>('profile');

  const fetchFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    try {
      const res = await publicSiteFeedService.listFeed({per_page: 50});
      setPostsState(mapPublicFeedList(res));
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to load feed'),
        type: 'danger',
      });
      setPostsState([]);
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const activeFilters = useMemo(
    () => buildActiveFilters(appliedFilters),
    [appliedFilters],
  );

  const posts = useMemo(
    () =>
      filterFeedPosts(postsState, {
        chip: activeChip,
        filters: appliedFilters,
        search,
      }),
    [activeChip, appliedFilters, postsState, search],
  );

  const draftResultCount = useMemo(() => {
    const previewChip = chipForFilterType(draftFilters.type, activeChip);
    return filterFeedPosts(postsState, {
      chip: previewChip,
      filters: draftFilters,
      search,
    }).length;
  }, [activeChip, draftFilters, postsState, search]);

  const onChipPress = useCallback((chip: FeedChipId) => {
    setActiveChip(chip);
    if (chip === 'All' || chip === 'For Sale' || chip === 'For Rent') {
      setAppliedFilters(prev => ({
        ...prev,
        type: chip === 'All' ? 'All' : chip,
      }));
    }
  }, []);

  const onOpenFilters = useCallback(() => {
    setDraftFilters(appliedFilters);
    setFilterSheetVisible(true);
  }, [appliedFilters]);

  const onCloseFilters = useCallback(() => {
    setFilterSheetVisible(false);
  }, []);

  const onResetFilters = useCallback(() => {
    setDraftFilters(DEFAULT_SHEET_FILTERS);
  }, []);

  const onApplyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setActiveChip(chipForFilterType(draftFilters.type, activeChip));
    setFilterSheetVisible(false);
  }, [activeChip, draftFilters]);

  const onRemoveActiveFilter = useCallback((key: string) => {
    setAppliedFilters(prev => {
      const next = {...prev};
      if (key === 'price') {
        next.pricePreset = null;
        next.priceMin = '';
        next.priceMax = '';
      }
      if (key === 'city') {
        next.city = null;
      }
      if (key === 'make') {
        next.make = null;
      }
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    (async () => {
      try {
        await publicSiteAuthService.logout().catch(() => undefined);
        await authService.logout().catch(() => undefined);
      } finally {
        await clearAuthSession();
        dispatch(clearSession());
      }
    })();
  }, [dispatch]);

  const onProfilePress = useCallback(() => {
    setSidebarActiveItem('profile');
    setSidebarVisible(true);
  }, []);

  const onCloseSidebar = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  const onSidebarItemPress = useCallback(
    (id: SidebarItemId) => {
      if (id === 'logout') {
        setSidebarVisible(false);
        Alert.alert('Log out', 'End your current session?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Log out', style: 'destructive', onPress: logout},
        ]);
        return;
      }

      setSidebarActiveItem(id);
      setSidebarVisible(false);

      if (id === 'profile') {
        navigation.navigate('CustomerEditProfile');
        return;
      }
      if (id === 'settings') {
        navigation.navigate('CustomerSettings');
        return;
      }
      if (id === 'saved') {
        navigation.navigate('CustomerSaved');
        return;
      }
      if (id === 'liked') {
        navigation.navigate('CustomerLiked');
        return;
      }
      if (id === 'shared') {
        navigation.navigate('CustomerShared');
        return;
      }
    },
    [logout, navigation],
  );

  const onNotificationsPress = useCallback(() => {
    navigation.navigate('CustomerNotifications');
  }, [navigation]);
  const onMessagesPress = useCallback(() => {
    navigation.navigate('CustomerMessages');
  }, [navigation]);
  const onPostPress = useCallback((_post: FeedPost) => {}, []);

  const onToggleLike = useCallback((postId: string) => {
    setPostsState(prev => {
      const target = prev.find(p => p.id === postId);
      if (!target) {
        return prev;
      }
      const liked = !target.liked;
      (async () => {
        try {
          if (liked) {
            await publicSiteFeedService.like(postId);
          } else {
            await publicSiteFeedService.unlike(postId);
          }
        } catch (error) {
          showMessage({
            message: getApiErrorMessage(error, 'Could not update like'),
            type: 'danger',
          });
          setPostsState(curr =>
            curr.map(post =>
              post.id === postId
                ? {
                    ...post,
                    liked: !liked,
                    likes: !liked
                      ? post.likes + 1
                      : Math.max(0, post.likes - 1),
                  }
                : post,
            ),
          );
        }
      })();
      return prev.map(post => {
        if (post.id !== postId) {
          return post;
        }
        return {
          ...post,
          liked,
          likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      });
    });
  }, []);

  const onToggleSave = useCallback((postId: string) => {
    setPostsState(prev => {
      const target = prev.find(p => p.id === postId);
      if (!target) {
        return prev;
      }
      const saved = !target.saved;
      (async () => {
        try {
          if (saved) {
            await publicSiteSavedVehiclesService.createPublicSavedVehicles({
              vehicle_id: postId,
            });
          } else {
            await publicSiteSavedVehiclesService.deletePublicSavedVehiclesById(
              postId,
            );
          }
        } catch (error) {
          showMessage({
            message: getApiErrorMessage(error, 'Could not update saved'),
            type: 'danger',
          });
          setPostsState(curr =>
            curr.map(post =>
              post.id === postId ? {...post, saved: !saved} : post,
            ),
          );
        }
      })();
      return prev.map(post =>
        post.id === postId ? {...post, saved} : post,
      );
    });
  }, []);

  const onShare = useCallback(async (post: FeedPost) => {
    try {
      await Share.share({
        message: `${post.title}\n${post.description}\n— ${post.sellerName}`,
      });
      await publicSiteFeedService.share(post.id).catch(() => undefined);
      setPostsState(prev =>
        prev.map(item =>
          item.id === post.id ? {...item, shared: true} : item,
        ),
      );
    } catch {
      // user cancelled
    }
  }, []);

  return {
    search,
    setSearch,
    activeChip,
    onChipPress,
    hasNotifications: true,
    isLoading: isLoadingFeed,
    posts,
    activeFilters,
    filterCount: activeFilters.length,
    filterSheetVisible,
    draftFilters,
    draftResultCount,
    sidebarVisible,
    sidebarActiveItem,
    userName: userName?.trim() || 'Ali Hassan',
    userEmail,
    onOpenFilters,
    onCloseFilters,
    onResetFilters,
    onApplyFilters,
    onDraftChange: setDraftFilters,
    onRemoveActiveFilter,
    onProfilePress,
    onCloseSidebar,
    onSidebarItemPress,
    onNotificationsPress,
    onMessagesPress,
    onPostPress,
    onToggleLike,
    onToggleSave,
    onShare,
  };
}
