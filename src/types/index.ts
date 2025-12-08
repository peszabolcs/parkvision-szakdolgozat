export interface ParkingSpace {
  id: string;
  status: 'occupied' | 'free';
  areaId: string;
  areaName: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  capacity: number;
  occupied: number;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  total: number;
  occupied: number;
  free: number;
  occupancyRate: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
