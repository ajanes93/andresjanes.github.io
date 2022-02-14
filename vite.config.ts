import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            reactivityTransform: true
        })
    ],
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            reporter: ['cobertura']
        }
    }
})
