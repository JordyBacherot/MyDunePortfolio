/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				heading: ['var(--font-heading)', 'sans-serif'],
				body: ['var(--font-body)', 'sans-serif'],
				dune: ['"Dune Rise"', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Semantic Dual Theme Palette
				theme: {
					base: "hsl(var(--theme-base))",
					surface: "hsl(var(--theme-surface))",
					primary: "hsl(var(--theme-primary))",
					accent: "hsl(var(--theme-accent))",
					glow: "hsl(var(--theme-glow))",
					shadow: "hsl(var(--theme-shadow))",
					title: "hsl(var(--theme-title))",
					raised: "hsl(var(--theme-raised))",
				},
				// Affiche animée du Hero (valeurs claires et sombres dans index.css)
				poster: {
					ink: "hsl(var(--poster-ink))",
					"ink-shadow": "hsl(var(--poster-ink-shadow))",
					frame: "hsl(var(--poster-frame))",
					paper: "hsl(var(--poster-paper))",
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'spice-glow': {
					'0%, 100%': { boxShadow: '0 0 15px hsl(var(--theme-accent) / 0.4)' },
					'50%': { boxShadow: '0 0 35px hsl(var(--theme-accent) / 0.8), 0 0 10px rgba(255, 255, 255, 0.2) inset' },
				}
			},
			animation: {
				'spice-glow': 'spice-glow 3s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
