import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    sveltekit()
  ],
  resolve: {
    alias: {
      'events': 'eventemitter3',
      'crypto': 'crypto-browserify'
    }
  }
});
