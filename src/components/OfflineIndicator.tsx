import { CloudOff, Wifi } from '@mui/icons-material';
import { Alert, Slide, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';

export const OfflineIndicator = () => {
  const { t } = useTranslation();
  const { isOnline } = usePWA();
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    if (isOnline && !showOnlineMessage) {
      setShowOnlineMessage(true);
      const timer = setTimeout(() => setShowOnlineMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOnlineMessage]);

  return (
    <>
      <Snackbar
        open={!isOnline}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert severity="warning" icon={<CloudOff />}>
          {t('pwa.offline')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showOnlineMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        autoHideDuration={3000}
        onClose={() => setShowOnlineMessage(false)}
      >
        <Alert severity="success" icon={<Wifi />}>
          {t('pwa.online')}
        </Alert>
      </Snackbar>
    </>
  );
};
