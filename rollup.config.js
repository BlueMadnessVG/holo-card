import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescriptEngine from "typescript";
import copy from "rollup-plugin-copy";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",

  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
      interop: "auto",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],

  external: ["react", "react/jsx-runtime", "react-dom", "@react-spring/web"],

 plugins: [
    // 1. Externalize peer deps first so they aren't bundled
    peerDepsExternal(),
    resolve({ extensions: [".ts", ".tsx", ".js", ".jsx", ".json"] }),

    // 2. TypeScript MUST be first so it can strip 'import type' and transpile JSX
    // before the rest of the pipeline sees the code.
    typescript({
        tsconfig: "./tsconfig.json",
        // These options ensure your declarations still end up in dist
        declaration: true,
        declarationDir: "dist/types",
        rootDir: "src",
        // This helps Rollup 4 understand how to handle the transformation
        sourceMap: true,
        inlineSources: true,
    }),

    // 3. Now that it's JS, resolve node_modules and convert CJS
    commonjs(),

    // 4. Handle assets and styles
    copy({
      targets: [{ src: "src/styles/*.css", dest: "dist/styles" }],
    }),

    postcss({
      extract: true, // Recommended for libraries
      minimize: isProd,
      inject: false,
      config: false,
    }),

    // 5. Minify last
    isProd && terser({
      compress: {
        passes: 2,
        pure_getters: true,
      },
      format: { comments: false },
    }),
  ].filter(Boolean),
};