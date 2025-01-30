import { useState, useEffect, useCallback, useRef } from 'react';
import { ERROR_MSG_PROCESSING } from 'src/constants';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const VITE_BACKEND_APP_URL = import.meta.env.VITE_BACKEND_APP_URL;

  const openConnection = useCallback((imageId: string) => {
    // Prevent reopening if already open
    if (wsRef.current) return;

    const ws = new WebSocket(`${VITE_BACKEND_APP_URL}/ws?image_id=${imageId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsOpen(true);
      console.log('WebSocket connection opened.');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setErrorMessage(data.error);
        } else if (data.presigned_url) {
          setImageUrl(data.presigned_url);
        }
      } catch (err) {
        setErrorMessage(ERROR_MSG_PROCESSING);
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      setIsOpen(false);
      wsRef.current = null;
      console.log('WebSocket connection closed.');
    };

    ws.onerror = (error) => {
      setErrorMessage(ERROR_MSG_PROCESSING);
      console.error('WebSocket error:', error);
    };
  }, [VITE_BACKEND_APP_URL]);

  const closeConnection = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, [closeConnection]);

  return { imageUrl, errorMessage, isOpen, openConnection, closeConnection };
}
