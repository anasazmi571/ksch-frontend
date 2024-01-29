import { Dispatch, SetStateAction, useCallback, useContext } from "react";
import { EventEntry, TeamMember } from "../models";
import { UserContext } from "../contexts/UserContext";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";

export default function OpenEventForm(
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

  const handleEntryEventChange = useCallback((entry: EventEntry, eventId: string) => {
    setEntries(e => {
      const index = e.findIndex(x => x.id === entry.id);
      if (index < 0) {
        return e;
      }
      return [
        ...e.slice(0, index),
        {
          ...entry,
          event: eventId
        },
        ...e.slice(index + 1)
      ];
    });
  }, [setEntries]);

  const handleEventMemberChange = useCallback((entry: EventEntry, tm: TeamMember[]) => {
    setEntries(e => {
      const index = e.findIndex(x => x.id === entry.id);
      if (index < 0) {
        return e;
      }
      return [
        ...e.slice(0, index),
        {
          ...e[index],
          members: tm.map(m => m.id)
        },
        ...e.slice(index + 1)
      ];
    });
  }, [setEntries]);

  const handleCreateEntry = useCallback(() => {
    setEntries(e => [
      ...e,
      {
        id: `entry-open-${e.length}`,
        event: userContext.openEvents[0]?.id ?? '',
        team: teamId,
        members: []
      }
    ]);
  }, [setEntries, teamId, userContext.openEvents]);
  
  const handleDeleteEntry = useCallback((id: string) => {
    setEntries(e => e.filter(x => x.id !== id));
  }, [setEntries]);

  return (
    <Stack spacing={2}>
      <Button onClick={handleCreateEntry}>Tambah Acara</Button>
      {entries.map((e, i) => (
        <Card>
          <CardContent>
            <Stack key={`entry-${i}-stack`} spacing={2}>
              <Typography variant='h6'>{`Penyertaan #${i + 1}`}</Typography>
              <Divider />
              <Autocomplete
                value={userContext.events.find(x => x.id === e.event)}
                onChange={(_, v) => handleEntryEventChange(e, v?.id ?? '')}
                options={userContext.openEvents}
                getOptionLabel={option => option.name}
                getOptionKey={option => option.id}
                renderInput={(params: TextFieldProps) => <TextField {...params} label="Acara" />}
                />
              <Autocomplete
                multiple
                value={userContext.teamMembers.filter(x => e.members.includes(x.id)) ?? []}
                onChange={(_, v) => handleEventMemberChange(e, v)}
                options={userContext.teamMembers.filter(x => x.team === teamId)}
                getOptionLabel={option => option.name}
                getOptionKey={option => option.nric}
                renderInput={(params: TextFieldProps) => <TextField {...params} label="Peserta" />}
                />
            </Stack>
          </CardContent>
          <CardActions>
            <Button onClick={() => handleDeleteEntry(e.id)}>Padam Penyertaan</Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
}