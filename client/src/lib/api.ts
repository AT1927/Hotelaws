import { apiRequest } from "./queryClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://7iw42r2i16.execute-api.us-east-1.amazonaws.com/dev';

export interface ApiResponse<T> {
  message: string;
  data?: T;
  [key: string]: any;
}

// Hotels API
export const hotelsApi = {
  create: async (hotelData: any) => {
    const response = await apiRequest('POST', `${API_BASE_URL}/api/hotels`, hotelData);
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`);
    if (!response.ok) throw new Error('Error al cargar hoteles');
    return response.json();
  }
};

// Services API
export const servicesApi = {
  create: async (serviceData: any) => {
    const response = await apiRequest('POST', `${API_BASE_URL}/api/services/add`, serviceData);
    return response.json();
  },
  assign: async (assignData: { HotelID: number; ServicioID: number }) => {
    const response = await apiRequest('POST', `${API_BASE_URL}/api/services/assign`, assignData);
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/services`);
    if (!response.ok) throw new Error('Error al cargar servicios');
    return response.json();
  }
};

// Promotions API
export const promotionsApi = {
  create: async (promotionData: any) => {
    const response = await apiRequest('POST', `${API_BASE_URL}/api/promotions/create`, promotionData);
    return response.json();
  },
  getActiveWithUsage: async () => {
    const response = await fetch(`${API_BASE_URL}/api/promociones/activas-con-uso`);
    if (!response.ok) throw new Error('Error al cargar promociones');
    return response.json();
  }
};

// Employees API
export const employeesApi = {
  register: async (employeeData: any) => {
    const response = await apiRequest('POST', `${API_BASE_URL}/api/employees/register`, employeeData);
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/employees`);
    if (!response.ok) throw new Error('Error al cargar empleados');
    return response.json();
  }
};

// Rooms API
export const roomsApi = {
  getAvailable: async (params: { hotelId: number; capacidadMin: number; fechaInicio: string; fechaFin: string }) => {
    const queryParams = new URLSearchParams({
      hotelId: params.hotelId.toString(),
      capacidadMin: params.capacidadMin.toString(),
      fechaInicio: params.fechaInicio,
      fechaFin: params.fechaFin
    });
    const response = await fetch(`${API_BASE_URL}/api/habitaciones/disponibles?${queryParams}`);
    if (!response.ok) throw new Error('Error al buscar habitaciones disponibles');
    return response.json();
  },
  getUnreserved: async () => {
    const response = await fetch(`${API_BASE_URL}/api/habitaciones/no-reservadas`);
    if (!response.ok) throw new Error('Error al cargar habitaciones sin reservas');
    return response.json();
  }
};

// Reservations API
export const reservationsApi = {
  createComplete: async (reservationData: any) => {
    const response = await apiRequest('POST', `${API_BASE_URL}/api/bookings/complete`, reservationData);
    return response.json();
  }
};

// Reports API
export const reportsApi = {
  getHotelRatings: async () => {
    const response = await fetch(`${API_BASE_URL}/api/hoteles/puntuacion-media`);
    if (!response.ok) throw new Error('Error al cargar puntuaciones');
    return response.json();
  },
  getLastMonthRevenue: async () => {
    const response = await fetch(`${API_BASE_URL}/api/hoteles/ingresos-ultimo-mes`);
    if (!response.ok) throw new Error('Error al cargar ingresos');
    return response.json();
  },
  getCurrentOccupancy: async () => {
    const response = await fetch(`${API_BASE_URL}/api/hoteles/ocupacion-actual`);
    if (!response.ok) throw new Error('Error al cargar ocupación');
    return response.json();
  }
};
