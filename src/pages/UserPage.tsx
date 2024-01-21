import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import SignUpForm from "../components/SignUpForm";
import { SignUpDetails } from "../models";
import { Navigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function UserPage() {
  const userContext = useContext(UserContext);
  const [details, setDetails] = useState<SignUpDetails>();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleUserSave = useCallback((v: SignUpDetails) => {
    setSuccess(false);
    setError(undefined);
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
    <Stack spacing={2}>
      {!userContext.user && <Navigate to='/daftar-masuk' replace />}
      <Typography variant="h2">Perihal Pengguna</Typography>
      {success && <Snackbar open={success} onClick={() => setSuccess(false)}><Alert severity='success' variant='filled'>Butir-butiran telah disimpan.</Alert></Snackbar>}
      {!!error && <Snackbar open={!!success} onClick={() => setError(undefined)}><Alert severity='error' variant='filled'>{error}</Alert></Snackbar>}
      <SignUpForm defaultValue={userContext.user} onSubmit={handleUserSave} />
    </Stack>
  );
}