import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/dashboard',
    component: ComponentCreator('/dashboard', 'd63'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'c85'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'ec5'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'c33'),
            routes: [
              {
                path: '/docs/fault-trees',
                component: ComponentCreator('/docs/fault-trees', '2bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/gsn',
                component: ComponentCreator('/docs/gsn', '79a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guidelines/hazard-identification',
                component: ComponentCreator('/docs/guidelines/hazard-identification', '24a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guidelines/risk-assessment',
                component: ComponentCreator('/docs/guidelines/risk-assessment', '359'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guidelines/safety-documentation',
                component: ComponentCreator('/docs/guidelines/safety-documentation', 'c94'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hazards',
                component: ComponentCreator('/docs/hazards', '0b1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/performance-indicators',
                component: ComponentCreator('/docs/performance-indicators', '6b7'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
