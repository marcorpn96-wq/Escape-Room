import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Escape-Room/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        stanze: resolve(__dirname, 'stanze.html'),
        prenotazione: resolve(__dirname, 'prenotazione.html'),
        classifica: resolve(__dirname, 'classifica.html'),
        faq: resolve(__dirname, 'faq.html'),
        schedaClown: resolve(__dirname, 'scheda-stanza-clown.html'),
        schedaSignoreOscuro: resolve(__dirname, 'scheda-stanza-signore-oscuro.html'),
        schedaSuora: resolve(__dirname, 'scheda-stanza-suora.html'),
      }
    }
  }
})