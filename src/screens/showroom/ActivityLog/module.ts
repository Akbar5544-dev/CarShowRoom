export type ActivityLogItem = {
  id: string;
  userName: string;
  action: string;
  timeAgo: string;
  ip: string;
};

export type ActivityLogController = {
  summary: string;
  items: ActivityLogItem[];
  isLoading: boolean;
  onBackPress: () => void;
};
