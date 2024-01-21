import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useContext, useMemo, useState } from "react";
import { UserType } from "../enums";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { SignUpDetails } from "../models";
import { UserContext } from "../contexts/UserContext";

export default function SignUpForm(
  {
    onSubmit,
    defaultValue,
    disabled
  }: {
    onSubmit: (details: SignUpDetails) => void,
    defaultValue?: SignUpDetails,
    disabled?: boolean
  }
) {
  const userContext = useContext(UserContext);
  const icPattern = useMemo(() => /^\d\d\d\d\d\d-\d\d-\d\d\d\d$/, []);
  const passwordPattern = useMemo(() => /^.{8,}$/, []);
  
  const [name, setName] = useState<string | undefined>(defaultValue?.name ?? '');
  const [phone, setPhone] = useState<string | undefined>(defaultValue?.phone ?? '');
  const [nric, setNric] = useState<string | undefined>(defaultValue?.nric ?? '');
  const [email, setEmail] = useState<string | undefined>(defaultValue?.email ?? '');
  const [password, setPassword] = useState<string | undefined>(defaultValue?.password ?? '');
  const [type, setType] = useState<UserType | undefined>(defaultValue?.type ?? 0);
  const [contingent, setContingent] = useState<string>(defaultValue?.contingent ?? '');

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
    if (!!defaultValue && !contingent) {
      return false;
    }
    return true;
  }, [name, phone, nric, email, password, icPattern, passwordPattern, type, contingent, defaultValue]);

  const handleSubmit = () => {
    if (!name || !email || !nric || !phone || !password || !type) {
      return false;
    }
    onSubmit({ name, phone, nric, email, password, type, contingent });
  };

  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        <TextField id='signup-name' label='Nama penuh' type='text' required value={name} onChange={(e) => setName(e.target.value)} margin="normal" variant="standard" />
        <TextField id='signup-phone' label='Nombor telefon' type='tel' required value={phone} onChange={(e) => setPhone(e.target.value)} margin="normal" variant="standard" />
        <TextField id='signup-ic' label='Nombor kad pengenalan' type='text' inputProps={{ pattern: icPattern }} required value={nric} onChange={(e) => setNric(e.target.value)} margin="normal" variant="standard" helperText="Gunakan format xxxxxx-xx-xxxx (contoh: 001122-01-1234)." />
        <TextField id='signup-email' label='Alamat emel' type='email' required value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" variant="standard" />
        <TextField id='signup-password' label='Kata laluan' type='password' inputProps={{ pattern: passwordPattern }} required value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" variant="standard" helperText="Panjang mesti 8 aksara atau lebih." />
        {!defaultValue && (
          <FormControl fullWidth>
            <InputLabel id='signup-type-label'>Jenis</InputLabel>
            <Select id='signup-type' labelId='signup-type-label' value={type} label='Jenis' onChange={(e) => setType(Number(e.target.value))}>
              <MenuItem value={UserType.TeamManager}>Pengurus Pasukan</MenuItem>
              <MenuItem value={UserType.Jury}>Ahli Juri</MenuItem>
            </Select>
          </FormControl>
        )}
        {type === UserType.TeamManager && (
          <TextField id='team-contingent' label='Kontinjen' select required value={contingent} onChange={(e) => setContingent(e.target.value)} margin="normal" variant="standard">
            {userContext.contingents.map(option => (
              <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
            ))}
          </TextField>
        )}
        <Button disabled={!formValuesAreValid || disabled} variant='contained' onClick={handleSubmit}>{!!defaultValue ? 'Simpan' : 'Daftar'}</Button>
      </Stack>
    </form>
  );
}