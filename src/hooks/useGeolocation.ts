import { useState, useCallback } from 'react';

interface GeolocationState {
  latitud: number | null;
  longitud: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitud: null,
    longitud: null,
    error: null,
    loading: false,
  });

  const requestPosition = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setState({
        latitud: null,
        longitud: null,
        error: 'La geolocalización no está soportada por el navegador',
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          latitud: null,
          longitud: null,
          error: error.message,
          loading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { ...state, requestPosition };
}
