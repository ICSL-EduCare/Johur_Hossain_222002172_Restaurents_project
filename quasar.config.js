// Quasar CLI (webpack) configuration
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-file
import { defineConfig } from '#q-app/wrappers'

export default defineConfig(() => {
  return {
    boot: [],

    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons', 'material-icons-outlined'],

    build: {
      vueRouterMode: 'hash',
      esbuildTarget: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
    },

    devServer: {
      server: { type: 'http' },
      open: true,
    },

    framework: {
      config: {
        brand: {},
        notify: { position: 'top-right', timeout: 2200 },
        dark: false,
      },
      plugins: ['Notify', 'Dialog', 'LocalStorage', 'Dark', 'Loading'],
    },

    animations: ['fadeIn', 'fadeOut', 'slideInRight', 'slideOutLeft'],
  }
})
