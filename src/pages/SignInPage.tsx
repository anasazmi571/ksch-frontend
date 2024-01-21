import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import SignInForm from "../components/SignInForm";
import { Navigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import LinkButton from "../components/LinkButton";

export default function SignInPage() {
  const [error, setError] = useState<string>();
  const [credentials, setCredentials] = useState<{email: string, password: string}>();
  const userContext = useContext(UserContext);

  const handleSignIn = useCallback((email: string | undefined, password: string | undefined) => {
    setError(undefined);
    if (!email || !password) {
      return;
    }
    setCredentials({email, password});
  }, []);

  useEffect(() => {
    if (!credentials) {
      return;
    }
    userContext.signIn(credentials.email, credentials.password).catch((err: Error) => {
      setError(JSON.stringify(err));
      setTimeout(() => setError(undefined), 6000);
    }).finally(() => {
      setCredentials(undefined);
    });
  }, [credentials, userContext]);

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant='h2'>Daftar Masuk</Typography>
      <Typography>Kali pertama di laman ini? Sila klik <LinkButton to='daftar' label='di sini' />.</Typography>
      {!!error && <Snackbar open><Alert severity='error' variant='filled'>{error}</Alert></Snackbar>}
      {!!credentials && <CircularProgress />}
      <SignInForm onSubmit={handleSignIn} disabled={!!credentials} />
      {userContext.user && <Navigate to='/' replace />}
    </Stack>
  );
}