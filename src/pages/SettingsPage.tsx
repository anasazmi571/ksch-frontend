import { useCallback, useContext, useEffect, useState } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { Settings } from "../models";
import SettingsForm from "../components/SettingsForm";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { UserContext } from "../contexts/UserContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SettingsPage() {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [settings, setSettings] = useState<Settings>();
  const userContext = useContext(UserContext);
  const settingsContext = useContext(SettingsContext);

  const handleSaveSettings = useCallback((value: Settings) => {
    setSuccess(false);
    setError(undefined);
    setSettings(value);
  }, []);

  useEffect(() => {
    if (!settings) {
      return;
    }
    settingsContext.setSettings(settings).then(() => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 6000);
    }).catch((error: Error) => {
      setError(JSON.stringify(error));
      setTimeout(() => setError(undefined), 6000);
    }).finally(() => {
      setSettings(undefined);
    });
  }, [settings, settingsContext]);

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant='h2'>Tetapan</Typography>
      {!!success && <Snackbar open><Alert severity='success' variant='filled'>Tetapan telah disimpan.</Alert></Snackbar>}
      {!!error && <Typography color='error'>{error}</Typography>}
      {!!settings && <CircularProgress />}
      <SettingsForm onSubmit={handleSaveSettings} disabled={!!settings || !userContext.user} />
    </Stack>
  );
}