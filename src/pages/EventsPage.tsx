import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import { Navigate } from "react-router-dom";
import { EventEntry, Team } from "../models";
import Alert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "../components/CustomTabPanel";
import MainEventForm from "../components/MainEventForm";
import OpenEventForm from "../components/OpenEventForm";
import Button from "@mui/material/Button";

export default function EventsPage() {
  const userContext = useContext(UserContext);

  const [team, setTeam] = useState<Team>();
  const [tab, setTab] = useState<string>('entry-main');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();
  const [mainEntries, setMainEntries] = useState<EventEntry[]>([]);
  const [openEntries, setOpenEntries] = useState<EventEntry[]>([]);

  useEffect(() => {
    if (!team) {
      setMainEntries([]);
      setOpenEntries([]);
    }
    setMainEntries(userContext.entries.filter(x => x.team === team?.id && !!userContext.mainEvents.find(y => y.id === x.event)));
    setOpenEntries(userContext.entries.filter(x => x.team === team?.id && !!userContext.openEvents.find(y => y.id === x.event)));
  }, [team, userContext.entries, userContext.mainEvents, userContext.openEvents]);

  const onSave = useCallback(() => {
    setSuccess(undefined);
    setError(undefined);
    setLoading(true);
    console.dir([...mainEntries, ...openEntries]);
    userContext.updateEntries([...mainEntries, ...openEntries]).then(
      (result) => {
        console.dir(result);
        setMainEntries(result.filter(x => x.team === team?.id && !!userContext.mainEvents.find(y => y.id === x.event)));
        setOpenEntries(result.filter(x => x.team === team?.id && !!userContext.openEvents.find(y => y.id === x.event)));
        setSuccess('Acara-acara telah berjaya disimpan.');
      }
    ).catch(
      e => {
        setError(JSON.stringify(e));
      }
    ).finally(
      () => {
        setLoading(false);
      }
    );
  }, [userContext, mainEntries, openEntries, team]);

  const formValuesAreValid = useMemo(() => {
    for (const entry of mainEntries) {
      const event = userContext.events.find(x => x.id === entry.event);
      if (!event) {
        return false;
      }
      if (mainEntries.filter(x => x.event === event.id).length > 1) {
        return false;
      }
      if (entry.members.length !== event.participants) {
        return false;
      }
    }
    for (const entry of openEntries) {
      const event = userContext.events.find(x => x.id === entry.event);
      if (!event) {
        return false;
      }
      if (openEntries.filter(x => x.event === event.id).length > 1) {
        return false;
      }
      if (entry.members.length !== event.participants) {
        return false;
      }
    }
    return true;
  }, [userContext, mainEntries, openEntries]);

  return !!userContext.user ? (
    <Stack spacing={2}>
      <Typography variant="h2">Perihal Acara</Typography>
      {!!success && <Snackbar open={!!success} onClick={() => setSuccess(undefined)}><Alert severity='success' variant='filled'>{success}</Alert></Snackbar>}
      {!!error && <Snackbar open={!!error} onClick={() => setError(undefined)}><Alert severity='error' variant='filled'>{error}</Alert></Snackbar>}
      {userContext.teams.length > 0 && (
        <Stack spacing={2}>
          <InputLabel id='entry-team-label'>Pasukan</InputLabel>
          <Select labelId='entry-team-label' value={team?.id} onChange={(e) => setTeam(userContext.teams.find(x => x.id === e.target.value))}>
            {userContext.teams.map((option, i) => (
              <MenuItem key={option.id} value={option.id}>{`Pasukan #${i + 1}`}</MenuItem>
            ))}
          </Select>
        </Stack>
      )}
      {userContext.teams.length < 1 && <Alert severity='error' variant='filled'>Sila tetapkan pasukan di halaman Pasukan.</Alert>}
      {!!team && (
        <Stack spacing={2}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                <Tab label='Acara Utama' value='entry-main' />
                <Tab label='Acara Terbuka' value='entry-open' />
              </Tabs>
            </Box>
            <CustomTabPanel currentValue={tab} value='entry-main'>
              <MainEventForm
              teamId={team?.id ?? ''}
              entries={mainEntries}
              setEntries={setMainEntries}
              />
            </CustomTabPanel>
            <CustomTabPanel currentValue={tab} value='entry-open'>
              <OpenEventForm
              teamId={team?.id ?? ''}
              entries={openEntries}
              setEntries={setOpenEntries}
              />
            </CustomTabPanel>
          </Box>
          <Button disabled={!team || !formValuesAreValid || !!loading} variant='contained' onClick={() => onSave()}>Simpan</Button>
        </Stack>
      )}
    </Stack>
  ) : <Navigate to='/daftar-masuk' replace />;
}