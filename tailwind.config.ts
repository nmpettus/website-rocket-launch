
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";
import containerQueriesPlugin from "@tailwindcss/container-queries";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* Theme-aware palette using CSS variables */
        cream: "hsl(var(--cream))",
        sage: {
          DEFAULT: "hsl(var(--sage))",
          light: "hsl(var(--sage-light))",
          dark: "hsl(var(--sage-dark))",
        },
        rose: {
          DEFAULT: "hsl(var(--rose))",
          light: "hsl(var(--rose-light))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
        },
        charcoal: "hsl(var(--charcoal))",
        lavender: "hsl(var(--lavender))",
        sky: "hsl(var(--sky))",
        softgreen: "hsl(var(--softgreen))",
        
        /* Semantic tokens */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: {
            DEFAULT: "hsl(var(--sidebar-primary))",
            foreground: "hsl(var(--sidebar-primary-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--sidebar-accent))",
            foreground: "hsl(var(--sidebar-accent-foreground))",
          },
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        sans: ["Nunito", "Quicksand", ...fontFamily.sans],
        display: ["Fredoka", "Baloo 2", "sans-serif"],
        heading: ["Fredoka", "sans-serif"],
        body: ["Nunito", "Quicksand", "sans-serif"],
        playful: ["Fredoka", "sans-serif"],
        fredoka: ["Fredoka", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" }
        },
        "float-up": {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "90%": { opacity: "0.8" },
          "100%": { transform: "translateY(-100px) rotate(360deg)", opacity: "0" }
        },
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        "bounce-big": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-30px)" }
        },
        "bounce-in": {
          "0%": { transform: "scale(0) translateY(50px)", opacity: "0" },
          "60%": { transform: "scale(1.1) translateY(-10px)" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" }
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        },
        "wave": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(10deg)" },
          "75%": { transform: "rotate(-10deg)" }
        },
        "wave-text": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        },
        "sparkle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" }
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
          "50%": { transform: "scale(1)" },
          "75%": { transform: "scale(1.15)" }
        },
        "blob": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20px, -30px) scale(1.1)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "75%": { transform: "translate(30px, 10px) scale(1.05)" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "75%, 100%": { transform: "scale(1.3)", opacity: "0" }
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" }
        },
        "maggie-jump": {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "20%": { transform: "translateY(-25px) rotate(-5deg)" },
          "40%": { transform: "translateY(-35px) rotate(3deg)" },
          "60%": { transform: "translateY(-20px) rotate(-2deg)" },
          "80%": { transform: "translateY(-10px) rotate(1deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" }
        },
        "tail-wag": {
          "0%, 100%": { transform: "rotate(-20deg)" },
          "25%": { transform: "rotate(25deg)" },
          "50%": { transform: "rotate(-15deg)" },
          "75%": { transform: "rotate(20deg)" }
        },
        "paw-appear": {
          "0%": { opacity: "0", transform: "scale(0) translateY(20px)" },
          "100%": { opacity: "0.6", transform: "scale(1) translateY(0)" }
        },
        "paw-fade": {
          "0%": { opacity: "0.6" },
          "100%": { opacity: "0" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "float": "float 4s ease-in-out infinite",
        "float-up": "float-up 20s linear infinite",
        "gentle-bounce": "gentle-bounce 2.5s ease-in-out infinite",
        "bounce-big": "bounce-big 0.8s ease-in-out infinite",
        "bounce-in": "bounce-in 0.6s ease-out",
        "wiggle": "wiggle 0.5s ease-in-out infinite",
        "wave": "wave 1s ease-in-out infinite",
        "wave-text": "wave-text 2s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "blob": "blob 8s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "maggie-jump": "maggie-jump 0.6s ease-out",
        "tail-wag": "tail-wag 0.4s ease-in-out infinite",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [animatePlugin, containerQueriesPlugin],
} satisfies Config;

export default config;
