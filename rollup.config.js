import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyFills from 'rollup-plugin-node-polyfills';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs',
  },
  plugins: [nodeResolve({
  	moduleDirectories: ['node_modules'],
  }), commonjs(), nodePolyFills()],
};
