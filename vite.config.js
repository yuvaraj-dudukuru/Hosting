import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        strictPort: false,
        proxy: {
            '/api': {
                target: 'http://localhost:4242',
                changeOrigin: true,
            },
        },
    },
    preview: {
        port: 4173,
        proxy: {
            '/api': {
                target: 'http://localhost:4242',
                changeOrigin: true,
            },
        },
    },
});
