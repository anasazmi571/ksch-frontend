import { useContext, useState } from "react";
import { Settings } from "../models";
import { SettingsContext } from "../contexts/SettingsContext";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function SettingsForm(
  {
    onSubmit,
    disabled
  }: {
    onSubmit: (v: Settings) => void,
    disabled?: boolean
  }
) {
  const settingsContext = useContext(SettingsContext);
  const [settings, setSettings] = useState<Settings>(settingsContext.settings);

  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        <TextField label="Tarikh Akhir Pendaftaran" type="date" value={settings.registrationDeadline} onChange={e => setSettings(s => ({ ...s, registrationDeadline: new Date(e.target.value) }))} />
        <TextField label="Tarikh Akhir Pengubahan Pasukan" type="date" value={settings.teamEditDeadline} onChange={e => setSettings(s => ({ ...s, teamEditDeadline: new Date(e.target.value) }))} />
        <Button disabled={disabled} variant='contained' onClick={() => onSubmit(settings)}>Simpan</Button>
      </Stack>
    </form>
  );
}