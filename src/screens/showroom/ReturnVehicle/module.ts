import {IconName} from '../../../assets/iconXml';

export type InspectionStat = {
  id: string;
  label: string;
  value: string;
  note: string;
  icon: IconName;
};

export type ExtraCharge = {
  id: string;
  label: string;
  amount: string;
};

export type ReturnVehicleControllerState = {
  isLoading: boolean;
  userName: string;
  dateLabel: string;
  rentalSummary: string;
  vehicle: {
    vin: string;
    title: string;
    specs: string;
  };
  inspectionStats: InspectionStat[];
  charges: ExtraCharge[];
  invoice: {
    rentalTotal: string;
    extras: string;
    subtotal: string;
    depositRefund: string;
    tax: string;
    amountDue: string;
  };
  setChargeAmount: (id: string, amount: string) => void;
  isSaveModalVisible: boolean;
  onInspectionPhotoPress: () => void;
  onSaveInspection: () => void;
  onCloseSaveModal: () => void;
  onConfirmSaveInspection: () => void;
  onCompleteReturn: () => void;
  onChargeComplete: () => void;
  onBackPress: () => void;
};

export type ReturnVehicleController = ReturnVehicleControllerState;
