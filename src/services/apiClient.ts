import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api', // Backend por defecto
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para inyectar token de forma global
apiClient.interceptors.request.use(
  (config) => {
    // Aquí podemos leer el token de las cookies o localStorage si fuera necesario para pasarlo
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('user-token'); // O donde esté guardado el JWT
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo genérico de errores (ej. redirigir a login si 401)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
