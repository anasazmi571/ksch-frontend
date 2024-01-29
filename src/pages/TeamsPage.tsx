import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "../components/CustomTabPanel";
import Button from "@mui/material/Button";
import TeamForm from "../components/TeamForm";
import { TeamFormDetails } from "../models";
import { Navigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function TeamsPage() {
  const userContext = useContext(UserContext);
  const [tab, setTab] = useState<string>('team0');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();

  const handleCreateTeam = useCallback(() => {
    if (!(!!userContext.user && !!userContext.user.contingent)) {
      return;
    }
    setLoading(true);
    setSuccess(undefined);
    setError(undefined);
    userContext.createTeam({ manager: userContext.user?.id ?? '' }).then(() => {
      setSuccess('Pasukan berjaya ditambah.');
      setTimeout(() => setSuccess(undefined), 6000);
    }).catch((reason: Error) => {
      setError(reason.message);
      setTimeout(() => setError(undefined), 6000);
    }).finally(() => {
      setLoading(false);
    });
  }, [userContext]);

  const handleSaveTeam = useCallback((teamId: string, details: TeamFormDetails) => {
    if (!(!!userContext.user && !!userContext.user.contingent)) {
      return;
    }
    setLoading(true);
    setSuccess(undefined);
    setError(undefined);
    userContext.updateTeam(teamId, details).then(() => {
      setSuccess('Pasukan berjaya dikemaskini.');
      setTimeout(() => setSuccess(undefined), 6000);
    }).catch((error: Error) => {
      setError(JSON.stringify(error));
      setTimeout(() => setError(undefined), 6000);
    }).finally(() => {
      setLoading(false);
    });
  }, [userContext]);

  const handleDeleteTeam = useCallback((teamId: string) => {
    if (!(!!userContext.user && !!userContext.user.contingent)) {
      return;
    }
    setLoading(true);
    setSuccess(undefined);
    setError(undefined);
    userContext.deleteTeam(teamId).then(() => {
      setSuccess('Pasukan berjaya dipadam.');
      setTimeout(() => setSuccess(undefined), 6000);
    }).catch((error: Error) => {
      setError(JSON.stringify(error));
      setTimeout(() => setError(undefined), 6000);
    }).finally(() => {
      setLoading(false);
    });
  }, [userContext]);

  return !!userContext.user ? (
    <Stack spacing={2}>
      <Typography variant="h2">Perihal Pasukan</Typography>
      {!!success && <Snackbar open={!!success} onClick={() => setSuccess(undefined)}><Alert severity='success' variant='filled'>{success}</Alert></Snackbar>}
      {!!error && <Snackbar open={!!error} onClick={() => setError(undefined)}><Alert severity='error' variant='filled'>{error}</Alert></Snackbar>}
      {!!userContext.user.contingent ? (
        <Stack spacing={2}>
          <Button disabled={loading || !userContext.user?.contingent} onClick={handleCreateTeam}>Tambah Pasukan</Button>
          {userContext.teams.length > 0 && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                  {userContext.teams.map((_, i) => <Tab key={`teamtab${i}`} label={`Pasukan #${i + 1}`} value={`team${i}`} />)}
                </Tabs>
              </Box>
              {!!userContext.user.contingent && userContext.teams.map((t, i) => (
                <CustomTabPanel key={`teamformpanel${i}`} currentValue={tab} value={`team${i}`}>
                  <TeamForm
                  key={`teamform${i}`}
                  disabled={loading}
                  contingent={userContext.user?.contingent ?? ''}
                  teamId={t.id}
                  onSave={d => handleSaveTeam(t.id, d)}
                  onDelete={() => handleDeleteTeam(t.id)}
                  defaultValue={{
                    category: t.category,
                    members: userContext.teamMembers.filter(m => m.team === t.id)
                  }}
                  />
                </CustomTabPanel>
              ))}
            </Box>
          )}
        </Stack>
      ) : <Alert severity='error' variant='filled'>Sila tetapkan kontinjen di halaman Pengguna.</Alert>}
    </Stack>
  ) : <Navigate to='/daftar-masuk' replace />;
}