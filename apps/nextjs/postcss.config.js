export default {
  plugins: {
    "@tailwindcss/postcss": {
      sources: [
        "./src/**/*.{ts,tsx}",
        "../../packages/ui/src/**/*.{ts,tsx}",
        "./node_modules/@scibo/ui/src/**/*.{ts,tsx}",
      ],
    },
  },
};
