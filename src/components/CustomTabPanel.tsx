import Box from "@mui/material/Box";
import { ReactNode } from "react";

export default function CustomTabPanel({
  children,
  value,
  currentValue
}: {
  children: ReactNode,
  value: string,
  currentValue: string
}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== currentValue}
      id={`simple-tabpanel-${currentValue}`}
    >
      {value === currentValue && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}