import { AppBar, AppBarProps, Link, Stack, Typography } from "@mui/material";

export default function SiteHeader(props: AppBarProps) {
  return (
    <AppBar position='sticky' color='primary' { ...props }>
      <Stack spacing={2}>
        <Stack direction='row' spacing={2} alignItems='center' padding={2}>
          <img src="logo.png" alt="Logo Persatuan Seni Silat Cekak Hanafi Malaysia" height="128px" width="128px" />
          <Typography variant='h3' color='primary'>Kejohanan Silat Cekak Hanafi Nasional {new Date().getFullYear()}</Typography>
        </Stack>
        <Stack direction='row' spacing={2} alignItems='center' maxHeight="200px">
          <Link href="/">Home</Link>
          <Link href="user">User</Link>
        </Stack>
      </Stack>
    </AppBar>
  );
}