import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

const isProd = process.env.NODE_ENV === "production";

// Custom plugin — takes the extracted CSS and injects it as a
// self-executing style tag when the JS bundle is first imported.
function injectCssPlugin() {
  return {
    name: "inject-css",
    generateBundle(_, bundle) {
      // Find the extracted CSS file in the bundle
      const cssFile = Object.values(bundle).find(
        (file) => file.type === "asset" && file.fileName.endsWith(".css")
      );
      if (!cssFile) return;

      const cssContent = cssFile.source
        .toString()
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`");

      // Prepend the injector to the ESM output
      const esmBundle = bundle["index.esm.js"];
      if (esmBundle && esmBundle.type === "chunk") {
        esmBundle.code =
          `(function(){if(typeof document==="undefined")return;` +
          `var id="holo-card-styles";` +
          `if(document.getElementById(id))return;` +
          `var s=document.createElement("style");` +
          `s.id=id;s.textContent=\`${cssContent}\`;` +
          `document.head.appendChild(s);})();\n` +
          esmBundle.code;
      }

      // Do the same for the CJS output
      const cjsBundle = bundle["index.js"];
      if (cjsBundle && cjsBundle.type === "chunk") {
        cjsBundle.code =
          `(function(){if(typeof document==="undefined")return;` +
          `var id="holo-card-styles";` +
          `if(document.getElementById(id))return;` +
          `var s=document.createElement("style");` +
          `s.id=id;s.textContent=\`${cssContent}\`;` +
          `document.head.appendChild(s);})();\n` +
          cjsBundle.code;
      }

      // Remove the CSS file from the bundle output — it's now inlined
      delete bundle[cssFile.fileName];
    },
  };
}

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

  external: ["react", "react/jsx-runtime", "react-dom", "framer-motion"],

  plugins: [
    peerDepsExternal(),
    resolve({ extensions: [".ts", ".tsx", ".js", ".jsx", ".json"] }),

    // Extract all CSS to a single file first
    postcss({
      extract: "dist/holo-card.css", // extract to a temp file
      inject: false,
      minimize: isProd,
      modules: false,
      use: { sass: null, stylus: null, less: null },
      config: false,
    }),

    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: "./tsconfig.json",
      sourceMap: true,
      inlineSources: true,
    }),

    commonjs(),

    copy({
      targets: [{ src: "src/styles/*.css", dest: "dist/styles" }],
    }),

    // Inject the extracted CSS into the JS bundle
    injectCssPlugin(),

    isProd && terser({
      compress: { passes: 2, pure_getters: true },
      format: { comments: false },
    }),
  ].filter(Boolean),
};