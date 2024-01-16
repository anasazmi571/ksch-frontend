import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { Category, Contingent, Events, TeamManager, TeamMember } from "../models";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";
import Fieldset from "./Fieldset";

export default function TeamForm() {
  const icPattern = useMemo(() => /^\d\d\d\d\d\d-\d\d-\d\d\d\d$/i, []);
  const allCategories: Category[] = useMemo(() => [
    {
      id: 'branch-male',
      name: 'Cawangan Lelaki'
    },
    {
      id: 'branch-female',
      name: 'Cawangan Wanita'
    },
    {
      id: 'uas-male',
      name: 'Universiti Awam/Swasta Lelaki'
    },
    {
      id: 'uas-female',
      name: 'Universiti Awam/Swasta Wanita'
    },
    {
      id: 'hs-male',
      name: 'Sekolah Menengah Tinggi Lelaki'
    },
    {
      id: 'hs-female',
      name: 'Sekolah Menengah Tinggi Wanita'
    },
    {
      id: 'ms-male',
      name: 'Sekolah Menengah Rendah Lelaki'
    },
    {
      id: 'ms-female',
      name: 'Sekolah Menengah Rendah Wanita'
    }
  ], []);
  const contingents: Contingent[] = useMemo(() => [
    {
      id: 'cawselangor',
      name: 'Cawangan Selangor',
      branch: true,
      uas: false,
      hs: false,
      ms: false
    },
    {
      id: 'uasutp',
      name: 'Universiti Teknologi Petronas',
      branch: false,
      uas: true,
      hs: false,
      ms: false
    },
    {
      id: 'scmckk',
      name: 'Kolej Melayu Kuala Kangsar',
      branch: false,
      uas: false,
      hs: true,
      ms: false
    }
  ], []);

  const [contingent, setContingent] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [memberNo, setMemberNo] = useState<number>(1);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [joiningMainEvent, setJoiningMainEvent] = useState<boolean>(false);
  const [joiningOpenEvent, setJoiningOpenEvent] = useState<boolean>(false);
  const [event1, setEvent1] = useState<boolean>(false);
  const [event2, setEvent2] = useState<boolean>(false);
  const [event3, setEvent3] = useState<boolean>(false);
  const [event4, setEvent4] = useState<boolean>(false);
  const [event5, setEvent5] = useState<boolean>(false);
  const [event6, setEvent6] = useState<boolean>(false);
  const [event7, setEvent7] = useState<boolean>(false);
  const [event8, setEvent8] = useState<boolean>(false);
  const [event9, setEvent9] = useState<boolean>(false);
  const [event10, setEvent10] = useState<boolean>(false);
  const [event11, setEvent11] = useState<boolean>(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(allCategories);
  const [events, setEvents] = useState<Events>({});

  useEffect(() => {
    const selectedContingent = contingents.find(x => x.id === contingent);
    if (!selectedContingent) {
      setAvailableCategories(allCategories);
    } else {
      setAvailableCategories(
        allCategories.filter(
          c => (selectedContingent.branch && c.id.includes('branch'))
            || (selectedContingent.uas && c.id.includes('uas'))
            || (selectedContingent.hs && c.id.includes('hs'))
            || (selectedContingent.ms && c.id.includes('ms'))
        )
      );
    }
  }, [contingent, allCategories, contingents]);

  useEffect(() => {
    setMembers(
      m => {
        if (m.length < memberNo) {
          return [...m, ...Array<TeamMember>(memberNo - m.length).fill({ id: '', name: '', nric: '' })];
        } else if (m.length > memberNo) {
          return m.slice(0, memberNo);
        } else {
          return m;
        }
      }
    );
  }, [memberNo]);

  const handleMemberNameChange = (index: number, value: string) => {
    if (index < 0 || index >= members.length) {
      return;
    }
    setMembers(
      m => [
        ...m.slice(0, index),
        {
          ...m[index],
          name: value
        },
        ...m.slice(index + 1)
      ]
    );
  };

  const handleMemberIcChange = (index: number, value: string) => {
    if (index < 0 || index >= members.length) {
      return;
    }
    setMembers(
      m => [
        ...m.slice(0, index),
        {
          ...m[index],
          nric: value
        },
        ...m.slice(index + 1)
      ]
    );
  };

  const handleMemberLeaderChange = (index: number) => {
    if (index < 0 || index >= members.length) {
      return;
    }
    setMembers(m => m.map((member, i) => ({ ...member, isLeader: index === i })));
  }

  const formValuesAreValid = useMemo(() => {
    if (!contingent || !category) {
      return false;
    }
    if (!contingents.find(x => x.id === contingent)) {
      return false;
    }
    if (!availableCategories.find(x => x.id === category)) {
      return false;
    }
    if (memberNo < 1) {
      return false;
    }
    let leaderExists = false;
    for (const member of members) {
      if (!member.name || !member.nric) {
        return false;
      }
      if (!icPattern.test(member.nric)) {
        return false;
      }
      if (member.isLeader) {
        leaderExists = true;
      }
    }
    if (!leaderExists) {
      return false;
    }
    return true;
  }, [availableCategories, category, contingent, contingents, icPattern, memberNo, members]);
  
  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        <FormGroup>
          <Fieldset title='Maklumat Penyertaan' elevation={2}>
            <TextField id='team-contingent' label='Kontinjen' select required value={contingent} onChange={(e) => setContingent(e.target.value)} margin="normal" variant="standard">
              {contingents.map(option => (
                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
              ))}
            </TextField>
            <TextField id='team-category' label='Peringkat penyertaan' select disabled={!contingent} required value={category} onChange={(e) => setCategory(e.target.value)} margin="normal" variant="standard">
              {availableCategories.map(option => (
                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
              ))}
            </TextField>
          </Fieldset>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Fieldset title='Maklumat Ahli Pasukan' elevation={2}>
            <TextField id='team-memberno' label='Bilangan ahli pasukan' type='number' inputProps={{ min: 1 }} required value={memberNo} onChange={(e) => setMemberNo(Number(e.target.value))} margin="normal" variant="standard" />
            {members.map((m, i) => (
              <Stack direction='row' spacing={2} alignItems='center'>
                <Typography>{i + 1}</Typography>
                <TextField id={`team-member-${i}-name`} label='Nama penuh' required value={m.name} onChange={(e) => handleMemberNameChange(i, e.target.value)} margin="normal" variant="standard" />
                <TextField id={`team-member-${i}-ic`} label='Nombor kad pengenalan' required value={m.nric} onChange={(e) => handleMemberIcChange(i, e.target.value)} margin="normal" variant="standard" />
                <FormControlLabel control={<Radio checked={m.isLeader} onChange={(_, __) => handleMemberLeaderChange(i)} />} label='Leader' />
              </Stack>
            ))}
          </Fieldset>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Fieldset title='Maklumat Acara' elevation={2}>
            <Stack spacing={2} direction='row' alignItems='center'>
              <Typography variant='h5'>Acara Utama</Typography>
              <Switch checked={joiningMainEvent} onChange={(_, checked) => setJoiningMainEvent(checked)} />
            </Stack>
            {joiningMainEvent
            ? (
            <Stack spacing={2}>
              <Typography variant='h6'>Kategori Utama - Tamat</Typography>
              <FormControlLabel control={<Switch checked={event1} onChange={(_, checked) => setEvent1(checked)} />} label='Acara 1: Gerak Senaman Cekak Hanafi + Buah Jatuh Kreatif' />
              {event1
              ? <Autocomplete multiple id="team-event1" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event2} onChange={(_, checked) => setEvent2(checked)} />} label='Acara 2: Umum Senjata' />
              {event2
              ? <Autocomplete multiple id="team-event2" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event3} onChange={(_, checked) => setEvent3(checked)} />} label='Acara 3: Umum Papan Sekeping' />
              {event3
              ? <Autocomplete multiple id="team-event3" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <Typography variant='h6'>Kategori Utama - Belum Tamat</Typography>
              <FormControlLabel control={<Switch checked={event4} onChange={(_, checked) => setEvent4(checked)} />} label='Acara 4: 4 Serang 1 + Serangan Serentak' />
              {event4
              ? <Autocomplete multiple id="team-event4" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event5} onChange={(_, checked) => setEvent5(checked)} />} label='Acara 5: Buah Jatuh (6 Buah Seragam)' />
              {event5
              ? <Autocomplete multiple id="team-event5" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
            </Stack>
            )
            : null}
            <Stack spacing={2} direction='row' alignItems='center'>
              <Typography variant='h5'>Acara Terbuka</Typography>
              <Switch checked={joiningOpenEvent} onChange={(_, checked) => setJoiningOpenEvent(checked)} />
            </Stack>
            {joiningOpenEvent
            ? (
            <Stack spacing={2}>
              <Typography variant='h6'>Kategori Terbuka - Tamat</Typography>
              <FormControlLabel control={<Switch checked={event6} onChange={(_, checked) => setEvent6(checked)} />} label='Acara 6: Menangkis Serangan Pisau' />
              {event6
              ? <Autocomplete multiple id="team-event6" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event7} onChange={(_, checked) => setEvent7(checked)} />} label='Acara 7: Menangkis Serangan Kaki' />
              {event7
              ? <Autocomplete multiple id="team-event7" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event8} onChange={(_, checked) => setEvent8(checked)} />} label='Acara 8: Menangkis Serangan Tongkat' />
              {event8
              ? <Autocomplete multiple id="team-event8" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event9} onChange={(_, checked) => setEvent9(checked)} />} label='Acara 9: Senaman Lading + Menangkis Serangan Menggunakan Parang Lading' />
              {event9
              ? <Autocomplete multiple id="team-event9" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <Typography variant='h6'>Kategori Terbuka - Belum Tamat</Typography>
              <FormControlLabel control={<Switch checked={event10} onChange={(_, checked) => setEvent10(checked)} />} label='Acara 10: Gerak Silat Sepasang' />
              {event10
              ? <Autocomplete multiple id="team-event10" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event11} onChange={(_, checked) => setEvent11(checked)} />} label='Acara 11: Gerak Silat Bertiga' />
              {event11
              ? <Autocomplete multiple id="team-event11" options={members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
            </Stack>
            )
            : null}
          </Fieldset>
        </FormGroup>
        <Divider />
        <Button type='submit' disabled={!formValuesAreValid} variant='contained'>Simpan</Button>
      </Stack>
    </form>
  );
}