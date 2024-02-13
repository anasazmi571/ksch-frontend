import Typography from "@mui/material/Typography";
import { Link, LinkProps } from "react-router-dom";

export default function LinkButton(props: { label: string } & LinkProps) {
  return (
    <Link style={{ textDecoration: 'none' }} {...props}>
      <Typography variant='button' color='primary' style={{ textDecoration: 'none' }}>
        {props.label}
      </Typography>
    </Link>
  );
}