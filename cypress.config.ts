import { defineConfig } from "cypress";
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      ...process.env, // Passa as variáveis VITE_ do .env para o Cypress
    },
    setupNodeEvents() { 
    },
  },
});