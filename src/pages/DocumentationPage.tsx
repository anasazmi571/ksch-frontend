import Stack from "@mui/material/Stack";
import LinkButton from "../components/LinkButton";
import Typography from "@mui/material/Typography";
import ReactPlayer from "react-player/file";

export default function DocumentationPage() {
  return (
    <Stack spacing={2}>
      <Typography variant='h2'>Dokumentasi</Typography>
      <Typography variant='h4'>Slaid Taklimat</Typography>
      <LinkButton to='/docs/Taklimat-Kejohanan-Silat-Cekak-Hanafi-Nasional-2024.pptx' label='Taklimat Kejohanan Silat Cekak Hanafi Nasional 2024' target='_blank' download />
      <Typography variant='h4'>Video Contoh</Typography>
      <Typography variant='h6'>Acara 1 - Senaman Cekak Hanafi & Buah Jatuh Kreatif</Typography>
      <ReactPlayer url='videos/acara1.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 2 - Umum Senjata</Typography>
      <ReactPlayer url='videos/acara2.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 3 - Umum Papan Sekeping</Typography>
      <ReactPlayer url='videos/acara3.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 4 - 4 Serang 1</Typography>
      <ReactPlayer url='videos/acara4.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 5 - Buah Jatuh 6 Seragam</Typography>
      <ReactPlayer url='videos/acara5.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 6 - Menangkis Serangan Pisau</Typography>
      <ReactPlayer url='videos/acara6.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 7 - Menangkis Serangan Kaki</Typography>
      <ReactPlayer url='videos/acara7.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 8 - Menangkis Serangan Tongkat</Typography>
      <ReactPlayer url='videos/acara8.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 9 - Senaman Lading dan Menangkis Serangan menggunakan Parang Lading</Typography>
      <ReactPlayer url='videos/acara9.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 10 - Gerak Silat Berdua</Typography>
      <ReactPlayer url='videos/acara10.mp4' width='50%' height='50%' controls={true} />
      <Typography variant='h6'>Acara 11 - Gerak Silat Bertiga</Typography>
      <ReactPlayer url='videos/acara11.mp4' width='50%' height='50%' controls={true} />
    </Stack>
  );
}