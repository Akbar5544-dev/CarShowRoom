import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

export type PickedMedia = {
  uri: string;
  type: string;
  name: string;
  fileSize?: number;
};

const DEFAULT_LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 0,
  quality: 0.8,
};

const SINGLE_LIBRARY_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 1,
  quality: 0.8,
};

const DEFAULT_CAMERA_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  quality: 0.8,
  saveToPhotos: false,
};

function assetToMedia(asset?: Asset | null): PickedMedia | null {
  if (!asset?.uri) {
    return null;
  }
  const type = asset.type || 'image/jpeg';
  const ext = type.includes('png')
    ? 'png'
    : type.includes('webp')
      ? 'webp'
      : 'jpg';
  const name =
    asset.fileName ||
    `upload_${Date.now()}.${ext}`;
  return {
    uri: asset.uri,
    type,
    name,
    fileSize: asset.fileSize,
  };
}

export async function pickFromGallery(
  options?: ImageLibraryOptions,
): Promise<PickedMedia | null> {
  const result = await launchImageLibrary({
    ...SINGLE_LIBRARY_OPTIONS,
    ...options,
  });
  if (result.didCancel || result.errorCode) {
    return null;
  }
  return assetToMedia(result.assets?.[0]);
}

/** Pick one or more photos from the gallery. selectionLimit 0 = unlimited. */
export async function pickMultipleFromGallery(
  options?: ImageLibraryOptions,
): Promise<PickedMedia[]> {
  const result = await launchImageLibrary({
    ...DEFAULT_LIBRARY_OPTIONS,
    selectionLimit: 0,
    ...options,
  });
  if (result.didCancel || result.errorCode || !result.assets?.length) {
    return [];
  }
  return result.assets
    .map(asset => assetToMedia(asset))
    .filter((item): item is PickedMedia => item != null);
}

export function formatMediaSelectionLabel(
  media: PickedMedia[],
): string | null {
  if (!media.length) {
    return null;
  }
  if (media.length === 1) {
    return media[0].name;
  }
  return `${media.length} photos selected`;
}

export async function pickFromCamera(
  options?: CameraOptions,
): Promise<PickedMedia | null> {
  const result = await launchCamera({
    ...DEFAULT_CAMERA_OPTIONS,
    ...options,
  });
  if (result.didCancel || result.errorCode) {
    return null;
  }
  return assetToMedia(result.assets?.[0]);
}

/** RN multipart file part for FormData.append */
export function toFormFile(media: PickedMedia) {
  return {
    uri: media.uri,
    type: media.type,
    name: media.name,
  } as unknown as Blob;
}

export function appendMediaToFormData(
  formData: FormData,
  field: string,
  media: PickedMedia,
) {
  formData.append(field, toFormFile(media));
}

export function appendMultipleMediaToFormData(
  formData: FormData,
  field: string,
  mediaList: PickedMedia[],
) {
  mediaList.forEach((media, index) => {
    appendMediaToFormData(formData, `${field}[${index}]`, media);
  });
}

export function createMediaFormData(
  field: string,
  media: PickedMedia,
  extra?: Record<string, string | number | undefined>,
): FormData {
  const formData = new FormData();
  appendMediaToFormData(formData, field, media);
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }
      formData.append(key, String(value));
    });
  }
  return formData;
}
