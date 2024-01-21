import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useMemo, useState } from "react";

export default function SignInForm(
  {
    onSubmit,
    disabled
  }: {
    onSubmit: (email: string, password: string) => void,
    disabled?: boolean
  }
) {
  const passwordPattern = useMemo(() => /^.{8,}$/, []);
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const formValuesAreValid = useMemo(() => {
    if (!email || !password) {
      return false;
    }
    if (!passwordPattern.test(password)) {
      return false;
    }
    return true;
  }, [email, password, passwordPattern]);

  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        <TextField id='signup-email' label='Alamat emel' type='email' required value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" variant="standard" />
        <TextField id='signup-password' label='Kata laluan' type='password' inputProps={{ pattern: passwordPattern }} required value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" variant="standard" helperText="Panjang mesti 8 aksara atau lebih." />
        <Button disabled={!formValuesAreValid || disabled} variant='contained' onClick={() => onSubmit(email, password)}>Daftar Masuk</Button>
      </Stack>
    </form>
  );
}