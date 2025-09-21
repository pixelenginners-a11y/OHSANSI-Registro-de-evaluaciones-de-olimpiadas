// frontend/src/services/apiService.ts

const API_BASE_URL = 'http://localhost:8200/api';

export type Area = {
  id: number;
  nombre: string;
  estado: 'Activo' | 'Inactivo';
  created_at: string;
  updated_at: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }
      
      return data;
    } catch (error) {
      console.error('Error en API:', error);
      throw error;
    }
  }

  // Métodos para Areas
  async getAreas(): Promise<ApiResponse<Area[]>> {
    return this.request<Area[]>('/areas');
  }

  async createArea(area: Omit<Area, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Area>> {
    return this.request<Area>('/areas', {
      method: 'POST',
      body: JSON.stringify(area),
    });
  }

  async updateArea(id: number, area: Omit<Area, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Area>> {
    return this.request<Area>(`/areas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(area),
    });
  }

  async deleteArea(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/areas/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleAreaStatus(id: number): Promise<ApiResponse<Area>> {
    return this.request<Area>(`/areas/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }
}

export const apiService = new ApiService();