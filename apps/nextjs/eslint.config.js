import baseConfig, { restrictEnvAccess } from "@scibo/eslint-config/base";
import nextjsConfig from "@scibo/eslint-config/nextjs";
import reactConfig from "@scibo/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
