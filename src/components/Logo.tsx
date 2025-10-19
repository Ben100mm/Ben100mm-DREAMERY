import React from "react";
import Box from "@mui/material/Box";

type Props = {
  variant?: "auto" | "light" | "dark"; // opposite of background when auto
  height?: number;
  alt?: string;
  lightSrc?: string;
  darkSrc?: string;
};

/**
 * Renders the Dreamery/Lumina logo with automatic light/dark variant.
 * Provide lightSrc and darkSrc; when variant is auto, it selects based on prefers-color-scheme.
 */
export const Logo: React.FC<Props> = ({
  variant = "auto",
  height = 72,
  alt = "Logo",
  lightSrc = "/logo-light.png",
  darkSrc = "/logo-dark.png",
}) => {
  const autoSrc = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? lightSrc
    : darkSrc;
  const src = variant === "auto" ? autoSrc : variant === "dark" ? darkSrc : lightSrc;

  return (
    <Box component="img" src={src} alt={alt} sx={{ height, width: "auto" }} />
  );
};

export default Logo;


