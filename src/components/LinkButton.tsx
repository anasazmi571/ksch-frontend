import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function LinkButton({
  to,
  label
}: {
  to: string,
  label: string
}) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Typography variant='button' color='primary' style={{ textDecoration: 'none' }}>
        {label}
      </Typography>
    </Link>
  );
}