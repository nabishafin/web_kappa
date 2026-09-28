import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Channel Infinity",
    short_name: "Infinity",
    description: "The future of independent animation.",
    start_url: "/home",
    display: "standalone",
    background_color: "#03010e",
    theme_color: "#030213",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
