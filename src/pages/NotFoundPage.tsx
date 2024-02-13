import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function NotFoundPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h2">Tidak Terjumpa</Typography>
      <Typography variant="body1">Halaman yang diminta tidak dijumpai.</Typography>
    </Stack>
  );
}