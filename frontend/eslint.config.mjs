// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
//   {
//     rules: {
//       "@typescript-eslint/no-explicit-any": ["warn"],

//       "@typescript-eslint/no-unused-vars": [
//         "error",
//         {
//           argsIgnorePattern: "^_",
//           varsIgnorePattern: "^_",
//         },
//       ],
//     },
//   },
// ];

// export default eslintConfig;
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const tsEslint = await import("@typescript-eslint/eslint-plugin");

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "@typescript-eslint": tsEslint.default,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
