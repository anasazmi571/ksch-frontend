import Divider from "@mui/material/Divider";
import Paper, { PaperProps } from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Fieldset(props: PaperProps & { title: string }) {
  return (
    <Paper {...props}>
      <Stack spacing={2} padding={2}>
        <Typography variant='h4'>{props.title}</Typography>
        <Divider light />
        {props.children}
      </Stack>
    </Paper>
  );
}