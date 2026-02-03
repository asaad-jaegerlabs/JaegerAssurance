/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Safety Management',
      items: [
        'hazards',
        'fault-trees',
        'performance-indicators',
        'gsn',
      ],
    },
    {
      type: 'category',
      label: 'Guidelines',
      items: [
        'guidelines/hazard-identification',
        'guidelines/risk-assessment',
        'guidelines/safety-documentation',
      ],
    },
  ],
};

module.exports = sidebars;
