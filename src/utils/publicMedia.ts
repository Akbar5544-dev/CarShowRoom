import {API_BASE_URL} from '../constants';

/** Build absolute URL for storage / relative media paths from the API. */
export function resolvePublicMediaUrl(
  path: string | null | undefined,
): string | null {
  if (!path || typeof path !== 'string') {
    return null;
  }
  const trimmed = path.trim();
  if (!trimmed) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const origin = API_BASE_URL.replace(/\/api\/?$/, '');
  const clean = trimmed.replace(/^\//, '');
  if (clean.startsWith('storage/')) {
    return `${origin}/${clean}`;
  }
  return `${origin}/storage/${clean}`;
}

export function formatFollowers(count: number): string {
  if (count >= 1000) {
    const k = count / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return String(count);
}

export function formatRelativeTime(raw: string | null | undefined): string {
  if (!raw) {
    return '';
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) {
    return 'Just now';
  }
  if (mins < 60) {
    return `${mins}m ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
}
