// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSG Mode Configuration
  ssr: false, // Disable SSR for pure static site generation
  nitro: {
    preset: 'static', // Use static preset for SSG
    prerender: {
      routes: ['/'],
      crawlLinks: true, // Automatically discover and prerender all routes
    },
  },

  // CSS Configuration
  css: ['~/assets/css/main.css'],

  // Modules
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/color-mode',
  ],

  // PostCSS Configuration (matching portfolio)
  postcss: {
    plugins: {
      '@csstools/postcss-oklab-function': { preserve: false },
      '@csstools/postcss-relative-color-syntax': { preserve: false },
      '@csstools/postcss-color-mix-function': { preserve: false },
      'postcss-preset-env': {
        stage: 0,
        features: {
          'nesting-rules': true,
        },
      },
      autoprefixer: {},
    },
  },

  // Vite Configuration (matching portfolio)
  vite: {
    css: {
      lightningcss: {
        targets: {
          safari: 15,
        },
      },
    },
    // Disable vue-tsc checking during dev (use pnpm typecheck instead)
    vue: {
      script: {
        propsDestructure: true,
      },
    },
    optimizeDeps: {
      include: ['@vue-flow/core', '@vue-flow/controls', '@vue-flow/minimap'],
    },
  },
  
  // Build Configuration
  build: {
    transpile: ['@vue-flow/core', '@vue-flow/controls', '@vue-flow/minimap'],
  },

  // i18n Configuration
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        dir: 'ltr',
        file: 'en.json',
      },
      {
        code: 'fa',
        language: 'fa-IR',
        name: 'فارسی',
        dir: 'rtl',
        file: 'fa.json',
      },
    ],
    lazy: true,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      redirectOn: 'root',
    },
    vueI18n: '~/i18n.config.ts',
  },

  // Color Mode Configuration
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  // Image Configuration
  image: {
    quality: 80,
    formats: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },

  // TypeScript Configuration
  typescript: {
    strict: true,
    shim: false,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
        paths: {
          '@': ['./app'],
          '@/*': ['./app/*'],
        },
      },
    },
  },

  // Components Configuration
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  // App Configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})
