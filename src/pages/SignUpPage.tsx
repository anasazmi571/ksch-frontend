import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useEffect, useState } from "react";
import SignUpForm from "../components/SignUpForm";
import { UserContext } from "../contexts/UserContext";
import { SignUpDetails } from "../models";
import { Navigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SignUpPage() {
  const userContext = useContext(UserContext);
  const [isPastDeadline, setIsPastDeadline] = useState<boolean>(false);
  const [details, setDetails] = useState<SignUpDetails>();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  
  const handleSignUp = useCallback((v: SignUpDetails) => {
    setDetails(v);
  }, []);

  useEffect(() => {
    if (!details) {
      return;
    }
    userContext.signUp(details).then(() => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 6000);
    }).catch((reason: Error) => {
      setError(reason.message);
      setTimeout(() => setError(undefined), 6000);
    }).finally(() => {
      setDetails(undefined);
    });
  }, [details, userContext]);

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant='h2'>Daftar Pengguna</Typography>
      <Typography>Pendaftaran hendaklah diisi oleh pengurus pasukan.</Typography>
      {!!error && <Snackbar open><Alert severity='error' variant='filled'>{error}</Alert></Snackbar>}
      <FormControlLabel control={<Switch checked={isPastDeadline} onChange={(_, checked) => setIsPastDeadline(checked)} />} label='Is past deadline? (debug)' />
      {!isPastDeadline ? <SignUpForm onSubmit={handleSignUp} /> : <Typography>Pendaftaran telah tamat. Terima kasih atas minat anda.</Typography>}
      {(!!success || !!userContext.user) && <Navigate to='/' replace />}
    </Stack>
  );
}