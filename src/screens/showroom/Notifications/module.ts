export type NotificationChannel = 'email' | 'sms';

export type NotificationEventId =
  | 'newRental'
  | 'returnDue'
  | 'lateReturns'
  | 'maintenanceDue'
  | 'insuranceExpiring'
  | 'newVehicle'
  | 'invoicePaid'
  | 'payrollProcessed';

export type NotificationEvent = {
  id: NotificationEventId;
  title: string;
  subtitle: string;
  email: boolean;
  sms: boolean;
};

export type NotificationSection = {
  id: string;
  title: string;
  events: NotificationEvent[];
};

export type NotificationsController = {
  userName: string;
  dateLabel: string;
  sections: NotificationSection[];
  onToggle: (
    sectionId: string,
    eventId: NotificationEventId,
    channel: NotificationChannel,
    value: boolean,
  ) => void;
  onBackPress: () => void;
  onSavePress: () => void;
};
