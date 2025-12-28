
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
	plugins: [
		reactRouter(),
		react(),
	],
	server: {
		watch: {
			ignored: [
				'**/app/public/Downloads/**',
				'**/build/**',
				'**/*.app/**',
				'**/*iCloud Drive*',
				'**/Desktop/**',
				'**/Install Spotify.app/**'
			]
		}
	}
});
