import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useState } from "react";
import SignUpForm from "../components/SignUpForm";
import { UserContext } from "../contexts/UserContext";
import { UserType } from "../enums";
import { SignUpDetails } from "../models";

export default function SignUpPage() {
  const userContext = useContext(UserContext);
  const [isPastDeadline, setIsPastDeadline] = useState<boolean>(false);
  const handleSignUp = useCallback((details: SignUpDetails) => {
    alert(`Name: ${details.name}, Phone: ${details.phone}, NRIC: ${details.nric}, Email address: ${details.email ?? 'N/A'}, Password: ${details.password ?? 'N/A'}, Type: ${details.type ?? 'N/A'}`);
  }, []);
  return (
    <Stack spacing={2} padding={2}>
      <Typography variant='h2'>Daftar Pengguna</Typography>
      <Typography>Pendaftaran hendaklah diisi oleh pengurus pasukan.</Typography>
      <FormControlLabel control={<Switch checked={isPastDeadline} onChange={(_, checked) => setIsPastDeadline(checked)} />} label='Is past deadline? (debug)' />
      {!isPastDeadline ? <SignUpForm onSubmit={handleSignUp} /> : <Typography>Pendaftaran telah tamat. Terima kasih atas minat anda.</Typography>}
    </Stack>
  );
}