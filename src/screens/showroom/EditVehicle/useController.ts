import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showMessage} from 'react-native-flash-message';
import {getApiErrorMessage} from '../../../api';
import type {VehiclesStackParamList} from '../../../navigation/types';
import {vehicleManagementVehiclesService} from '../../../services';
import {useAppDispatch} from '../../../store/hooks';
import {invalidateVehicles} from '../../../store/dataCacheSlice';
import {
  asRecord,
  buildVehicleUpdateFormData,
  mapApiVehicleToEditForm,
  pickVehicleImageUri,
  unwrapData,
} from '../../../utils';
import {createMediaFormData, pickFromGallery} from '../../../utils/mediaPicker';
import type {
  EditVehicleController,
  EditVehicleForm,
  EditVehicleRouteParams,
  EditVehicleSectionId,
} from './module';

type Nav = NativeStackNavigationProp<VehiclesStackParamList, 'EditVehicle'>;
type Route = RouteProp<VehiclesStackParamList, 'EditVehicle'>;

const QUICK_NAV = [
  {id: 'basic' as const, label: 'Basic Info', icon: 'stepPerson' as const},
  {id: 'pricing' as const, label: 'Pricing', icon: 'activityDollar' as const},
  {id: 'insurance' as const, label: 'Insurance', icon: 'settingsSecurity' as const},
  {id: 'media' as const, label: 'Media', icon: 'camera' as const},
];

export function useEditVehicleController(): EditVehicleController {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const params = route.params;
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<EditVehicleForm>(() =>
    mapApiVehicleToEditForm(asRecord({}), params),
  );
  const [availableForRent, setAvailableForRent] = useState(
    () => (params.status ?? 'Available') === 'Available',
  );
  const [activeSection, setActiveSection] = useState<EditVehicleSectionId>('basic');
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(params.imageUri);
  const [imageTint, setImageTint] = useState(params.imageTint);

  const sectionOffsets = useRef<Partial<Record<EditVehicleSectionId, number>>>({});
  const scrollRef = useRef<{scrollTo: (options: {y: number; animated?: boolean}) => void} | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!params.vehicleId) {
        setLoading(false);
        return;
      }
      try {
        const response = await vehicleManagementVehiclesService.getVehiclesById(
          params.vehicleId,
        );
        if (!mounted) {
          return;
        }
        const row = asRecord(unwrapData(response));
        setForm(mapApiVehicleToEditForm(row, params));
        setAvailableForRent(
          !String(row.status ?? '')
            .toLowerCase()
            .match(/inactive|sold|maint/),
        );

        const primaryImage = pickVehicleImageUri(row);
        if (primaryImage) {
          setImageUri(primaryImage);
        }

        const images = Array.isArray(row.images) ? row.images : [];
        const uris = images
          .map(item => {
            const imageRow = asRecord(item);
            return (
              pickVehicleImageUri(imageRow) ||
              (typeof item === 'string' ? item : null)
            );
          })
          .filter((uri): uri is string => Boolean(uri));
        if (uris.length) {
          setPhotoUris(uris);
        }
      } catch (error) {
        showMessage({
          message: getApiErrorMessage(error, 'Failed to load vehicle'),
          type: 'danger',
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params]);

  const vehicleTitle = useMemo(() => {
    const model = form.model || params.model || 'i5 M60';
    return model.includes('xDrive') ? model : `${model} xDrive`;
  }, [form.model, params.model]);

  const subtitle = useMemo(
    () =>
      `Update specifications, pricing, insurance and media for ${form.brand || params.make} ${form.model || params.model}.`,
    [form.brand, form.model, params.make, params.model],
  );

  const setField = useCallback((key: keyof EditVehicleForm, value: string) => {
    setForm(current => ({...current, [key]: value}));
  }, []);

  const onBackToInventoryPress = useCallback(() => {
    navigation.navigate('VehicleList');
  }, [navigation]);

  const onCancelPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSavePress = useCallback(async () => {
    if (!params.vehicleId || saving) {
      return;
    }
    setSaving(true);
    try {
      const formData = buildVehicleUpdateFormData(form, availableForRent);
      await vehicleManagementVehiclesService.updateVehiclesById(
        params.vehicleId,
        formData,
      );
      dispatch(invalidateVehicles());

      showMessage({message: 'Vehicle updated successfully', type: 'success'});
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to update vehicle'),
        type: 'danger',
      });
    } finally {
      setSaving(false);
    }
  }, [availableForRent, dispatch, form, navigation, params.vehicleId, saving]);

  const onQuickNavPress = useCallback((id: EditVehicleSectionId) => {
    setActiveSection(id);
    const offset = sectionOffsets.current[id];
    if (offset != null) {
      scrollRef.current?.scrollTo({y: Math.max(offset - 12, 0), animated: true});
    }
  }, []);

  const onAddPhotoPress = useCallback(async () => {
    if (!params.vehicleId) {
      return;
    }
    const picked = await pickFromGallery();
    if (!picked?.uri) {
      return;
    }
    try {
      await vehicleManagementVehiclesService.uploadImages(
        params.vehicleId,
        createMediaFormData('image', picked),
      );
      setPhotoUris(current => [...current, picked.uri!].slice(0, 12));
      showMessage({message: 'Photo uploaded', type: 'success'});
    } catch (error) {
      showMessage({
        message: getApiErrorMessage(error, 'Failed to upload photo'),
        type: 'danger',
      });
    }
  }, [params.vehicleId]);

  const registerSectionOffset = useCallback((id: EditVehicleSectionId, offset: number) => {
    sectionOffsets.current[id] = offset;
  }, []);

  const setScrollRef = useCallback(
    (ref: {scrollTo: (options: {y: number; animated?: boolean}) => void} | null) => {
      scrollRef.current = ref;
    },
    [],
  );

  return {
    plateNo: form.registration || params.plateNo || 'LEA-2251',
    vehicleTitle,
    subtitle,
    imageUri,
    imageTint,
    availableForRent,
    quickNav: QUICK_NAV,
    activeSection,
    form,
    photoUris,
    loading,
    saving,
    setField,
    setAvailableForRent,
    onBackToInventoryPress,
    onCancelPress,
    onSavePress,
    onQuickNavPress,
    onAddPhotoPress,
    registerSectionOffset,
    setScrollRef,
  };
}
