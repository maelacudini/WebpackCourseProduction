import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig( [
  { files: [ "**/*.{js,mjs,cjs,ts,mts,cts}" ], plugins: { js }, extends: [ "js/recommended" ] },
  { files: [ "**/*.{js,mjs,cjs,ts,mts,cts}" ], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { files: [ "**/*.css" ], plugins: { css }, language: "css/css", extends: [ "css/recommended" ] },
  tseslint.configs.recommended,
  {
    rules: {
      "no-console": "error",
      "curly": [ "error", "all" ],
      "max-len": [ "error", { "code": 200, "tabWidth": 4 } ],
      "indent": [ "error", 2 ],
      "no-unused-vars": "error",
      "max-depth": [ "error", 2 ],
      "max-params": [ "error", 3 ],
      "complexity": [ "error", 6 ],
      "object-curly-spacing": [ "error", "always" ],
      "semi": [ "error", "always" ]
    }
  },
  globalIgnores( [
    "**/node_modules",
    "**/dist",
    "**/.gitignore",
    "tsconfig.json",
    "package.json",
    "package-lock.json"
  ] ),
] );
