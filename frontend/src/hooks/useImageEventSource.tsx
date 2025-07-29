import { useState, useEffect, useCallback, useRef } from 'react';
import { ImageEventData } from 'src/types';

const BACKEND_APP_URL = import.meta.env.BACKEND_APP_URL;

export function useImageEventSource() {
  const eventSourceRef = useRef(null);
  const currentImageIdRef = useRef(null);

  const [eventMessage, setEventMessage] = useState<ImageEventData>();

  const closeConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      currentImageIdRef.current = null;
      setEventMessage(undefined);
    }
  }, []);

  const openConnection = useCallback(
    (imageId: string) => {
      if (currentImageIdRef.current === imageId) return;

      // Close previous EventSource if exists
      closeConnection();

      const eventSource = new EventSource(`${BACKEND_APP_URL}/events/${imageId}`);
      eventSourceRef.current = eventSource;
      currentImageIdRef.current = imageId;

      eventSource.onmessage = (event) => {
        const data: ImageEventData = JSON.parse(event.data);
        setEventMessage(data);
      };

      eventSource.onerror = (err) => {
        console.error('EventSource error:', err);
        closeConnection();
      };
    },
    [closeConnection]
  );

  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, [closeConnection]);

  return { openConnection, closeConnection, eventMessage };
}
