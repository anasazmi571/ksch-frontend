import { CircularProgress, Link } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import SignInForm from "../components/SignInForm";
import { Navigate } from "react-router-dom";

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
    userContext.signIn(credentials.email, credentials.password).catch((reason: Error) => {
      console.dir(reason.message);
      setError(reason.message);
    }).finally(() => {
      setCredentials(undefined);
    });
  }, [credentials]);

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant='h2'>Daftar Masuk</Typography>
      <Typography>Kali pertama di laman ini? Sila klik <Link underline='hover' variant='button' href='daftar'>di sini</Link>.</Typography>
      {!!error && <Typography color='error'>{error}</Typography>}
      {!!credentials && <CircularProgress />}
      <SignInForm onSubmit={handleSignIn} disabled={!!credentials} />
      {userContext.user && <Navigate to='/' replace />}
    </Stack>
  );
}