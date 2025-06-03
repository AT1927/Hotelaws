// API functions for hotel management system

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://en5c7nrd9c.execute-api.us-east-1.amazonaws.com/prod';

export interface ApiResponse<T> {
  message: string;
  data?: T;
  [key: string]: any;
}

// Hotels API
export const hotelsApi = {
  create: async (hotelData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotelData)
    });
    if (!response.ok) throw new Error('Error al crear hotel');
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
    const response = await fetch(`${API_BASE_URL}/api/services/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    });
    if (!response.ok) throw new Error('Error al crear servicio');
    return response.json();
  },
  assign: async (assignData: { HotelID: number; ServicioID: number }) => {
    const response = await fetch(`${API_BASE_URL}/api/services/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignData)
    });
    if (!response.ok) throw new Error('Error al asignar servicio');
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
    const response = await fetch(`${API_BASE_URL}/api/promotions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promotionData)
    });
    if (!response.ok) throw new Error('Error al crear promoción');
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
    const response = await fetch(`${API_BASE_URL}/api/employees/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    if (!response.ok) throw new Error('Error al registrar empleado');
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/employees`);
    if (!response.ok) throw new Error('Error al cargar empleados');
    return response.json();
  }
};

// Roles API
export const rolesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/roles`);
    if (!response.ok) throw new Error('Error al cargar roles');
    return response.json();
  }
};

// Rooms API
export const roomsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/rooms`);
    if (!response.ok) throw new Error('Error al cargar habitaciones');
    return response.json();
  },
  create: async (roomData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/rooms/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData)
    });
    if (!response.ok) throw new Error('Error al crear habitación');
    return response.json();
  },
  getAvailable: async (params: { hotelId: number; capacidadMin: number; fechaInicio: string; fechaFin: string; wifi?: boolean }) => {
    const queryParams = new URLSearchParams({
      hotelId: params.hotelId.toString(),
      capacidadMin: params.capacidadMin.toString(),
      fechaInicio: params.fechaInicio,
      fechaFin: params.fechaFin
    });
    if (params.wifi) {
      queryParams.append('wifi', 'true');
    }
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

// Room Types API
export const roomTypesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/room-types`);
    if (!response.ok) throw new Error('Error al cargar tipos de habitación');
    return response.json();
  }
};

// Reservations API
export const reservationsApi = {
  createComplete: async (reservationData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/bookings/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData)
    });
    if (!response.ok) throw new Error('Error al crear reserva');
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/reservations`);
    if (!response.ok) throw new Error('Error al cargar reservas');
    return response.json();
  }
};

// Clients API
export const clientsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/clients`);
    if (!response.ok) throw new Error('Error al cargar clientes');
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
