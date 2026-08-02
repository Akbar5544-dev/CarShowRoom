export type EditRoleMatrixColumn = {
  id: string;
  label: string;
};

export type EditRoleMatrixRow = {
  id: string;
  label: string;
  grants: Record<string, boolean>;
};

export type EditRoleController = {
  name: string;
  description: string;
  active: boolean;
  matrixColumns: EditRoleMatrixColumn[];
  matrixRows: EditRoleMatrixRow[];
  modulesCount: number;
  permissionsGranted: number;
  permissionsTotal: number;
  summaryStatus: string;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setActive: (value: boolean) => void;
  toggleGrant: (moduleId: string, columnId: string) => void;
  onBackPress: () => void;
  onCancelPress: () => void;
  onSavePress: () => void;
};
