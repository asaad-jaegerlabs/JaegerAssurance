// @ts-check
const path = require('path');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Safety Dashboard',
  tagline: 'Comprehensive Safety Management System',
  favicon: 'img/favicon.ico',

  url: 'https://your-docusaurus-site.com',
  baseUrl: '/',

  organizationName: 'your-org',
  projectName: 'safety-dashboard',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    function tailwindPlugin() {
      return {
        name: 'tailwind-plugin',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
        configureWebpack() {
          return {
            resolve: {
              alias: {
                '@': path.resolve(__dirname),
              },
              modules: [
                path.resolve(__dirname, '..', 'node_modules'),
                'node_modules',
              ],
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Safety Dashboard',
        logo: {
          alt: 'Safety Dashboard Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/dashboard',
            label: 'Dashboard',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Hazard Management',
                to: '/docs/hazards',
              },
            ],
          },
          {
            title: 'Dashboard',
            items: [
              {
                label: 'View Dashboard',
                to: '/dashboard',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Safety Dashboard. Built with Docusaurus.`,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
