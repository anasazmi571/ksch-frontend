import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useMemo, useState } from "react";
import { Category, TeamFormDetails, TeamMember } from "../models";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";
import Fieldset from "./Fieldset";
import { UserContext } from "../contexts/UserContext";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

export default function TeamForm(
  {
    contingent,
    teamId,
    defaultValue,
    disabled,
    onSave,
    onDelete
  }: {
    contingent: string,
    teamId: string,
    defaultValue?: TeamFormDetails,
    disabled?: boolean,
    onSave: (details: TeamFormDetails) => void,
    onDelete?: () => void
  }
) {
  const userContext = useContext(UserContext);
  const icPattern = useMemo(() => /^\d\d\d\d\d\d-\d\d-\d\d\d\d$/i, []);

  const [memberNo, setMemberNo] = useState<number>(1);
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
  const [availableCategories, setAvailableCategories] = useState<Category[]>(userContext.categories);
  const [team, setTeam] = useState<TeamFormDetails>({
    category: undefined,
    members: [],
    events: {
      team: teamId
    }
  });
  const [defaultIsSet, setDefaultIsSet] = useState<boolean>(false);

  useEffect(() => {
    if (!defaultIsSet && !!defaultValue) {
      setTeam(defaultValue);
      for (const p of Object.keys(defaultValue.events).filter(x => x !== 'team')) {
        //
      }
      setDefaultIsSet(true);
    }
  }, [defaultValue, defaultIsSet]);

  useEffect(() => {
    const selectedContingent = userContext.contingents.find(x => x.id === contingent);
    if (!selectedContingent) {
      setAvailableCategories(userContext.categories);
    } else {
      setAvailableCategories(
        userContext.categories.filter(
          c => (selectedContingent.branch && c.id.includes('branch'))
            || (selectedContingent.uas && c.id.includes('uas'))
            || (selectedContingent.hs && c.id.includes('hs'))
            || (selectedContingent.ms && c.id.includes('ms'))
        )
      );
    }
  }, [contingent, userContext]);

  useEffect(() => {
    setTeam(
      t => {
        let m = t.members;
        if (m.length < memberNo) {
          m = [...m, ...Array<TeamMember>(memberNo - m.length).fill({ id: '', name: '', nric: '', team: teamId })];
        } else if (m.length > memberNo) {
          m = m.slice(0, memberNo);
        }
        return {
          ...t,
          members: m
        };
      }
    );
  }, [memberNo, teamId]);

  const handleMemberNameChange = (index: number, value: string) => {
    if (index < 0 || index >= team.members.length) {
      return;
    }
    setTeam(
      t => ({
        ...t,
        members: [
          ...team.members.slice(0, index),
          {
            ...team.members[index],
            name: value
          },
          ...team.members.slice(index + 1)
        ]
      })
    );
  };

  const handleMemberIcChange = (index: number, value: string) => {
    if (index < 0 || index >= team.members.length) {
      return;
    }
    setTeam(
      t => ({
        ...t,
        members: [
          ...t.members.slice(0, index),
          {
            ...t.members[index],
            nric: value
          },
          ...t.members.slice(index + 1)
        ]
      })
    );
  };

  const handleEventMemberChange = (eventIndex: number, tm: TeamMember[]) => {
    const indexStr = `event${eventIndex}`;
    const memberIndices = tm.map(m => team.members.findIndex(x => x === m)).filter(x => x >= 0);
    setTeam(
      t => ({
        ...t,
        events: {
          ...t.events,
          [indexStr]: memberIndices
        }
      })
    );
  };

  const handleMemberLeaderChange = (index: number) => {
    if (index < 0 || index >= team.members.length) {
      return;
    }
    setTeam(
      t => ({
        ...t,
        members: t.members.map((member, i) => ({ ...member, isLeader: index === i }))
      })
    );
  }

  const formValuesAreValid = useMemo(() => {
    if (!contingent || !team.category) {
      return false;
    }
    if (!userContext.contingents.find(x => x.id === contingent)) {
      return false;
    }
    if (!availableCategories.find(x => x.id === team.category)) {
      return false;
    }
    if (memberNo < 1) {
      return false;
    }
    let leaderExists = false;
    for (const member of team.members) {
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
  }, [availableCategories, contingent, icPattern, memberNo, team, userContext]);
  
  return (
    <form autoComplete="off">
      <Stack spacing={2}>
        <FormGroup>
          <Fieldset title='Maklumat Penyertaan' elevation={2}>
            <FormControl fullWidth>
              <InputLabel id='team-category-label'>Peringkat penyertaan</InputLabel>
              <Select id='team-category' labelId='team-category-label' value={team.category} label='Peringkat penyertaan' onChange={(e) => setTeam({ ...team, category: e.target.value })}>
                {availableCategories.map(option => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Fieldset>
        </FormGroup>
        <Divider />
        <FormGroup>
          <Fieldset title='Maklumat Ahli Pasukan' elevation={2}>
            <TextField id='team-memberno' label='Bilangan ahli pasukan' type='number' inputProps={{ min: 1 }} required value={memberNo} onChange={(e) => setMemberNo(Number(e.target.value))} margin="normal" variant="standard" />
            {team.members.map((m, i) => (
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
              ? <Autocomplete multiple id="team-event1" value={team.events.event1?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(1, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event2} onChange={(_, checked) => setEvent2(checked)} />} label='Acara 2: Umum Senjata' />
              {event2
              ? <Autocomplete multiple id="team-event2" value={team.events.event2?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(2, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event3} onChange={(_, checked) => setEvent3(checked)} />} label='Acara 3: Umum Papan Sekeping' />
              {event3
              ? <Autocomplete multiple id="team-event3" value={team.events.event3?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(3, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <Typography variant='h6'>Kategori Utama - Belum Tamat</Typography>
              <FormControlLabel control={<Switch checked={event4} onChange={(_, checked) => setEvent4(checked)} />} label='Acara 4: 4 Serang 1 + Serangan Serentak' />
              {event4
              ? <Autocomplete multiple id="team-event4" value={team.events.event4?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(4, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event5} onChange={(_, checked) => setEvent5(checked)} />} label='Acara 5: Buah Jatuh (6 Buah Seragam)' />
              {event5
              ? <Autocomplete multiple id="team-event5" value={team.events.event5?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(5, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
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
              ? <Autocomplete multiple id="team-event6" value={team.events.event6?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(6, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event7} onChange={(_, checked) => setEvent7(checked)} />} label='Acara 7: Menangkis Serangan Kaki' />
              {event7
              ? <Autocomplete multiple id="team-event7" value={team.events.event7?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(7, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event8} onChange={(_, checked) => setEvent8(checked)} />} label='Acara 8: Menangkis Serangan Tongkat' />
              {event8
              ? <Autocomplete multiple id="team-event8" value={team.events.event8?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(8, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event9} onChange={(_, checked) => setEvent9(checked)} />} label='Acara 9: Senaman Lading + Menangkis Serangan Menggunakan Parang Lading' />
              {event9
              ? <Autocomplete multiple id="team-event9" value={team.events.event9?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(9, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <Typography variant='h6'>Kategori Terbuka - Belum Tamat</Typography>
              <FormControlLabel control={<Switch checked={event10} onChange={(_, checked) => setEvent10(checked)} />} label='Acara 10: Gerak Silat Sepasang' />
              {event10
              ? <Autocomplete multiple id="team-event10" value={team.events.event10?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(10, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
              <FormControlLabel control={<Switch checked={event11} onChange={(_, checked) => setEvent11(checked)} />} label='Acara 11: Gerak Silat Bertiga' />
              {event11
              ? <Autocomplete multiple id="team-event11" value={team.events.event11?.map(x => team.members[x]) ?? []} onChange={(_, v) => handleEventMemberChange(11, v)} options={team.members} getOptionLabel={option => option.name} getOptionKey={option => option.nric} renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />} />
              : null}
            </Stack>
            )
            : null}
          </Fieldset>
        </FormGroup>
        <Divider />
        <Stack direction='row' spacing={2} alignItems='stretch'>
          <Button disabled={!formValuesAreValid || disabled} variant='contained' onClick={() => onSave(team)}>Simpan</Button>
          {!!team && !!onDelete && <Button disabled={disabled} variant='contained' onClick={() => onDelete()}>Padam</Button>}
        </Stack>
      </Stack>
    </form>
  );
}