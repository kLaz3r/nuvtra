import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { withUt } from "uploadthing/tw";

export default withUt({
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      boxShadow: {
        post: "0px 3px 30px 0px rgba(235, 94, 40, 0.25)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        text: "rgba(245, 241, 239, 1)",
        accent: "rgba(120, 140, 173, 1)",
        secondary: "rgba(66, 109, 98, 1)",
        background: "rgba(10, 7, 6, 1)",
        primary: "rgba(235, 94, 40, 1)",
      },
      backgroundImage: {
        "gradient-border":
          "linear-gradient(to right, rgba(235, 94, 40, 1), rgba(66, 109, 98, 1))",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config);
