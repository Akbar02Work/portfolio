import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			sans: [
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif'
			],
			serif: [
				'Crimson Pro',
				'ui-serif',
				'Georgia',
				'Cambria',
				'Times New Roman',
				'Times',
				'serif'
			],
			mono: [
				'SF Mono',
				'ui-monospace',
				'SFMono-Regular',
				'Menlo',
				'Monaco',
				'Consolas',
				'Liberation Mono',
				'Courier New',
				'monospace'
			]
		},
		extend: {
			fontSize: {
				// ── Display Layer ──────────────────────────────────────────
				'display-hero': ['clamp(2.5rem, 5vw + 1rem, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '900' }],
				'display-404': ['clamp(8.5rem, 30vh, 22rem)', { lineHeight: '0.85', letterSpacing: '-0.02em', fontWeight: '700' }],
				// ── Heading Layer (High Contrast) ──────────────────────────
				'heading-1': ['clamp(2.25rem, 4vw + 0.75rem, 3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '900' }],
				'heading-2': ['clamp(1.5rem, 2vw + 0.75rem, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
				'heading-3': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
				// ── Body Layer ─────────────────────────────────────────────
				'body-lg': ['clamp(1rem, 0.5vw + 0.875rem, 1.25rem)', { lineHeight: '1.7', letterSpacing: '0em', fontWeight: '400' }],
				'body-base': ['clamp(0.875rem, 0.3vw + 0.8rem, 1rem)', { lineHeight: '1.7', letterSpacing: '0em', fontWeight: '400' }],
				'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
				// ── Utility Layer ──────────────────────────────────────────
				'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.06em', fontWeight: '500' }],
				'button': ['0.875rem', { lineHeight: '1', letterSpacing: '0em', fontWeight: '500' }],
				'code': ['0.8125rem', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			boxShadow: {
				'2xs': 'var(--shadow-2xs)',
				xs: 'var(--shadow-xs)',
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)'
			},
			transitionDuration: {
				400: '400ms'
			},
			transitionTimingFunction: {
				'out-expo': 'cubic-bezier(0.16,1,0.3,1)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
