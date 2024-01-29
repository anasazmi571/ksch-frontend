import Stack from "@mui/material/Stack";
import { EventEntry, TeamMember, TournamentEvent } from "../models";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Divider from "@mui/material/Divider";

function EventCategoryEntryForm(
  {
    title,
    events,
    entries,
    members,
    onMemberChange,
    onEventChange
  }: {
    title: string,
    events: TournamentEvent[],
    entries: EventEntry[],
    members: TeamMember[],
    onMemberChange: (e: TournamentEvent, v: TeamMember[]) => void,
    onEventChange: (e: TournamentEvent, v: boolean) => void
  }
) {
  return (
    <Stack spacing={2}>
      <Typography variant='h6'>{title}</Typography>
      {events.map(e => (
        <Stack key={`team-event-${e.id}`} spacing={2}>
          <FormControlLabel control={<Switch checked={entries.findIndex(x => x.event === e.id) >= 0} onChange={(_, checked) => onEventChange(e, checked)} />} label={`${e.name} (${e.participants} Peserta)`} />
          {entries.findIndex(x => x.event === e.id) >= 0
            && <Autocomplete
            multiple
            value={members.filter(x => entries.find(t => t.event === e.id)?.members.includes(x.id) ?? [])}
            onChange={(_, v) => onMemberChange(e, v)}
            options={members}
            getOptionLabel={option => option.name}
            getOptionKey={option => option.nric}
            renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />}
            />}
        </Stack>
      ))}
    </Stack>
  );
}

export default function MainEventForm(
  {
    teamId,
    entries,
    setEntries
  }: {
    teamId: string,
    entries: EventEntry[],
    setEntries: Dispatch<SetStateAction<EventEntry[]>>
  }
) {
  const userContext = useContext(UserContext);

  const [defaultIsSet, setDefaultIsSet] = useState<boolean>(false);
  const [joining, setJoining] = useState<boolean>(false);

  useEffect(() => {
    if (!defaultIsSet) {
      setJoining(!!entries.find(x => !!userContext.mainEvents.find(e => e.id === x.event)));
      setDefaultIsSet(true);
    }
  }, [entries, defaultIsSet, userContext.mainEvents]);
  
  const handleEventMemberChange = useCallback((event: TournamentEvent, tm: TeamMember[]) => {
    const existing = entries.findIndex(x => x.event === event.id);
    if (existing >= 0) {
      setEntries([
        ...entries.slice(0, existing),
        {
          ...entries[existing],
          members: tm.map(m => m.id)
        },
        ...entries.slice(existing)
      ]);
    } else {
      setEntries([
        ...entries,
        {
          id: '',
          team: teamId,
          event: event.id,
          members: tm.map(m => m.id)
        }
      ]);
    }
  }, [entries, teamId, setEntries]);

  const handleEventJoinChange = useCallback((event: TournamentEvent, joining: boolean) => {
    if (joining) {
      const existing = entries.find(x => x.event === event.id);
      if (!existing) {
        setEntries([
          ...entries,
          {
            id: '',
            team: teamId,
            event: event.id,
            members: []
          }
        ]);
      }
    } else {
      setEntries(entries.filter(x => x.event !== event.id));
    }
  }, [entries, teamId, setEntries]);

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction='row' alignItems='center'>
        <Typography variant='h5'>Acara Utama</Typography>
        <Switch checked={joining} onChange={(_, checked) => setJoining(checked)} />
      </Stack>
      {joining
      && (
      <Stack spacing={2}>
        <EventCategoryEntryForm
          title='Acara Utama - Tamat'
          events={userContext.mainEvents.filter(x => !!x.graduatesOnly)}
          entries={entries}
          members={userContext.teamMembers.filter(x => x.team === teamId)}
          onMemberChange={handleEventMemberChange}
          onEventChange={handleEventJoinChange}
          />
        <Divider />
        <EventCategoryEntryForm
          title='Acara Utama - Belum Tamat'
          events={userContext.mainEvents.filter(x => !x.graduatesOnly)}
          entries={entries}
          members={userContext.teamMembers.filter(x => x.team === teamId)}
          onMemberChange={handleEventMemberChange}
          onEventChange={handleEventJoinChange}
          />
      </Stack>
      )}
    </Stack>
  );
}