import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs({
      include: /node_modules/
    }),
    // First copy CSS files as-is to dist
    copy({
      targets: [
        { 
          src: 'src/styles/*.css', 
          dest: 'dist/styles',
          rename: (name, extension) => `${name}${extension}`
        }
      ]
    }),
    // Then process CSS imports
    postcss({
      extract: false, // Don't extract to separate file
      modules: false, // Disable CSS modules
      minimize: true,
      inject: true, // Inject CSS into JS bundle
      use: {
        sass: null, // Disable Sass processing
        stylus: null, // Disable Stylus
        less: null // Disable Less
      },
      config: false // Disable PostCSS config
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: './tsconfig.json',
      clean: true
    }),
    terser()
  ],
  external: ['react', 'react-dom', '@react-spring/web']
};