// Tailwind CSS v4 uses zero-config via @tailwindcss/vite.
// Keeping this file minimal to avoid conflicts.
import type { Config } from 'tailwindcss'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
} satisfies Config
