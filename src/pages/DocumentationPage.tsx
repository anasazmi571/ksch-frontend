import Stack from "@mui/material/Stack";
import LinkButton from "../components/LinkButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ReactPlayer from "react-player/file";
import Tabs from "@mui/material/Tabs";
import { Tab } from "@mui/material";
import CustomTabPanel from "../components/CustomTabPanel";

export default function DocumentationPage() {
  const [open, setOpen] = useState<string>('1');
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setOpen(newValue);
  };
  return (
    <Stack spacing={2}>
      <Typography variant='h2'>Dokumentasi</Typography>
      <Typography variant='h4'>Slaid Taklimat</Typography>
      <LinkButton to='/docs/Taklimat-Kejohanan-Silat-Cekak-Hanafi-Nasional-2024.pptx' label='Muat turun slaid taklimat' target='_blank' download />
      <Typography variant='h4'>Video Contoh</Typography>
      <Tabs variant="scrollable" value={open} onChange={handleChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab value='1' label="Acara 1" />
        <Tab value='2' label="Acara 2" />
        <Tab value='3' label="Acara 3" />
        <Tab value='4' label="Acara 4" />
        <Tab value='5' label="Acara 5" />
        <Tab value='6' label="Acara 6" />
        <Tab value='7' label="Acara 7" />
        <Tab value='8' label="Acara 8" />
        <Tab value='9' label="Acara 9" />
        <Tab value='10' label="Acara 10" />
        <Tab value='11' label="Acara 11" />
      </Tabs>
      <CustomTabPanel value='1' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 1 - Senaman Cekak Hanafi & Buah Jatuh Kreatif</Typography>
          <ReactPlayer url='videos/acara1.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='2' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 2 - Umum Senjata</Typography>
          <ReactPlayer url='videos/acara2.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='3' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 3 - Umum Papan Sekeping</Typography>
          <ReactPlayer url='videos/acara3.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='4' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 4 - 4 Serang 1</Typography>
          <ReactPlayer url='videos/acara4.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='5' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 5 - Buah Jatuh 6 Seragam</Typography>
          <ReactPlayer url='videos/acara5.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='6' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 6 - Menangkis Serangan Pisau</Typography>
          <ReactPlayer url='videos/acara6.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='7' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 7 - Menangkis Serangan Kaki</Typography>
          <ReactPlayer url='videos/acara7.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='8' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 8 - Menangkis Serangan Tongkat</Typography>
          <ReactPlayer url='videos/acara8.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='9' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 9 - Senaman Lading dan Menangkis Serangan menggunakan Parang Lading</Typography>
          <ReactPlayer url='videos/acara9.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='10' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 10 - Gerak Silat Berdua</Typography>
          <ReactPlayer url='videos/acara10.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
      <CustomTabPanel value='11' currentValue={open}>
        <Stack spacing={2}>
          <Typography variant='h4'>Acara 11 - Gerak Silat Bertiga</Typography>
          <ReactPlayer url='videos/acara11.mp4' width='50%' height='50%' controls={true} />
        </Stack>
      </CustomTabPanel>
    </Stack>
  );
}