import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@scibo/tailwind-config/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/src/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
    keyframes: {
      spinner: {
        from: { opacity: "1" },
        to: { opacity: "0.15" },
      },
      skeleton: {
        "0%": { "background-position": "100% 50%" },
        "100%": { "background-position": "0% 50%" },
      },
    },
    animation: {
      skeleton: "skeleton 2s linear infinite",
      spinner: "spinner 1.2s linear infinite",
    },
  },
} satisfies Config;
