import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useMemo, useState } from "react";
import { UserType } from "../enums";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { SignUpDetails } from "../models";

export default function SignUpForm(
  {
    onSubmit
  }: {
    onSubmit: (details: SignUpDetails) => void
  }
) {
  const icPattern = useMemo(() => /^\d\d\d\d\d\d-\d\d-\d\d\d\d$/, []);
  const passwordPattern = useMemo(() => /^.{8,}$/, []);
  
  const [name, setName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [nric, setNric] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [type, setType] = useState<UserType>();

  const formValuesAreValid = useMemo(() => {
    if (!name || !email || !nric || !phone || !password || !type) {
      return false;
    }
    if (!icPattern.test(nric)) {
      return false;
    }
    if (!passwordPattern.test(password)) {
      return false;
    }
    if (type !== UserType.TeamManager && type !== UserType.Jury) {
      return false;
    }
    return true;
  }, [name, phone, nric, email, password, icPattern]);

  const handleSubmit = () => {
    if (!name || !email || !nric || !phone || !password || !type) {
      return false;
    }
    onSubmit({ name, phone, nric, email, password, type });
  };

  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        <TextField id='signup-name' label='Nama penuh' type='text' required value={name} onChange={(e) => setName(e.target.value)} margin="normal" variant="standard" />
        <TextField id='signup-phone' label='Nombor telefon' type='tel' required value={phone} onChange={(e) => setPhone(e.target.value)} margin="normal" variant="standard" />
        <TextField id='signup-ic' label='Nombor kad pengenalan' type='text' inputProps={{ pattern: icPattern }} required value={nric} onChange={(e) => setNric(e.target.value)} margin="normal" variant="standard" helperText="Gunakan format xxxxxx-xx-xxxx (contoh: 001122-01-1234)." />
        <TextField id='signup-email' label='Alamat emel' type='email' required value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" variant="standard" />
        <TextField id='signup-password' label='Kata laluan' type='password' inputProps={{ pattern: passwordPattern }} required value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" variant="standard" helperText="Panjang mesti 8 aksara atau lebih." />
        <FormControl fullWidth>
          <InputLabel id='signup-type-label'>Jenis</InputLabel>
          <Select id='signup-type' labelId='signup-type-label' value={type} label='Jenis' onChange={(e) => setType(Number(e.target.value))}>
            <MenuItem value={UserType.TeamManager}>Pengurus Pasukan</MenuItem>
            <MenuItem value={UserType.Jury}>Ahli Juri</MenuItem>
          </Select>
        </FormControl>
        <Button type='submit' disabled={!formValuesAreValid} variant='contained' onClick={handleSubmit}>Daftar</Button>
      </Stack>
    </form>
  );
}