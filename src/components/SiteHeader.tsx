import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinkButton from './LinkButton';
import { UserType } from "../enums";



export default function SiteHeader(props: AppBarProps) {
  const userContext = useContext(UserContext);
  return (
    <AppBar position='sticky' color='primary' { ...props }>
      <Stack spacing={2}>
        <Stack direction='row' spacing={2} alignItems='center' padding={2}>
          <img src="logo.png" alt="Logo Persatuan Seni Silat Cekak Hanafi Malaysia" height="128px" width="128px" />
          <Typography variant='h3' color='primary'>Kejohanan Silat Cekak Hanafi Nasional {new Date().getFullYear()}</Typography>
        </Stack>
        <Stack direction='row' spacing={2} alignItems='center' maxHeight="200px">
          <LinkButton to='/' label='Utama' />
          <Divider orientation="vertical" />
          {!!userContext.user && <LinkButton to='/pengguna' label='Pengguna' />}
          {!!userContext.user && userContext.user.type === UserType.TeamManager && <LinkButton to='/pasukan' label='Pasukan' />}
          {!!userContext.user && userContext.user.type === UserType.TeamManager && <LinkButton to='/acara' label='Acara' />}
          <LinkButton to='/tetapan' label='Tetapan' />
          <Divider orientation="vertical" />
          {!!userContext.user ? <LinkButton to='/daftar-keluar' label='Daftar Keluar' /> : <LinkButton to='/daftar-masuk' label='Daftar Masuk' />}
          {!userContext.user && <LinkButton to='/daftar' label='Daftar' />}
        </Stack>
      </Stack>
    </AppBar>
  );
}