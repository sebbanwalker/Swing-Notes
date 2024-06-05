// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/notes": {
				target: "http://localhost:5000", // Your backend server port
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
