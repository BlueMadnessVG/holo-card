import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",

  output: [
    // CommonJS — for Node / older bundlers
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
      // Preserve JSX runtime interop for CJS consumers
      interop: "auto",
    },
    // ES Module — for modern bundlers (tree-shakeable)
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],

  // Don't bundle peer deps or React internals
  external: ["react", "react/jsx-runtime", "react-dom", "@react-spring/web"],

  plugins: [
    // Mark peer deps external automatically
    peerDepsExternal(),

    // Resolve node_modules (needed for any non-peer deps)
    resolve({ extensions: [".ts", ".tsx", ".js"] }),

    // CJS → ESM interop
    commonjs({ include: /node_modules/ }),

    // Copy raw CSS files to dist/styles so consumers can import them à la carte
    copy({
      targets: [{ src: "src/styles/*.css", dest: "dist/styles" }],
      hook: "buildStart", // run before the build so postcss can also pick them up
    }),

    // Process CSS imports inside component files (inject into JS bundle)
    postcss({
      extract: false,
      modules: false,
      minimize: isProd,
      inject: true,
      use: { sass: null, stylus: null, less: null },
      config: false,
    }),

    // TypeScript
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: "./tsconfig.json",
      clean: true,
    }),

    // Minify only in production
    isProd && terser({
      compress: {
        passes: 2,          // extra optimisation pass
        pure_getters: true,
      },
      format: { comments: false },
    }),
  ].filter(Boolean),
};
