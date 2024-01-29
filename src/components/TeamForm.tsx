import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Category, TeamFormDetails, TeamMember } from "../models";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
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

  const [memberNo, setMemberNo] = useState<number>(defaultValue?.members.length ?? 1);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(userContext.categories);
  const [team, setTeam] = useState<TeamFormDetails>(defaultValue ?? {
    category: undefined,
    members: []
  });
  const [defaultIsSet, setDefaultIsSet] = useState<boolean>(false);

  useEffect(() => {
    if (!defaultIsSet && !!defaultValue) {
      setMemberNo(defaultValue.members.length);
      setTeam(defaultValue);
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

  const handleMemberNameChange = useCallback((index: number, value: string) => {
    if (index < 0 || index >= team.members.length) {
      return;
    }
    setTeam({
      ...team,
      members: [
        ...team.members.slice(0, index),
        {
          ...team.members[index],
          name: value
        },
        ...team.members.slice(index + 1)
      ]
    });
  }, [team]);

  const handleMemberIcChange = useCallback((index: number, value: string) => {
    if (index < 0 || index >= team.members.length) {
      return;
    }
    setTeam({
      ...team,
      members: [
        ...team.members.slice(0, index),
        {
          ...team.members[index],
          nric: value
        },
        ...team.members.slice(index + 1)
      ]
    });
  }, [team]);

  const handleMemberLeaderChange = useCallback((index: number) => {
    if (index < 0 || index >= team.members.length) {
      return;
    }
    setTeam({
      ...team,
      members: team.members.map((member, i) => ({ ...member, isLeader: index === i }))
    });
  }, [team]);

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
              <Stack key={`team-member-${i}-stack`} direction='row' spacing={2} alignItems='center'>
                <Typography>{i + 1}</Typography>
                <TextField id={`team-member-${i}-name`} label='Nama penuh' required value={m.name} onChange={(e) => handleMemberNameChange(i, e.target.value)} margin="normal" variant="standard" />
                <TextField id={`team-member-${i}-ic`} label='Nombor kad pengenalan' required value={m.nric} onChange={(e) => handleMemberIcChange(i, e.target.value)} margin="normal" variant="standard" />
                <FormControlLabel control={<Radio checked={m.isLeader} onChange={(_, __) => handleMemberLeaderChange(i)} />} label='Leader' />
              </Stack>
            ))}
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