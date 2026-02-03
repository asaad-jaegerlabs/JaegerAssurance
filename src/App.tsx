// This file redirects to the Docusaurus application
// The main entry point is now at /src/pages/index.tsx

export default function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
        <h1>Safety Dashboard - Docusaurus Site</h1>
        <p>This application is now a Docusaurus documentation site.</p>
        <p>Please run the following command to start the site:</p>
        <code style={{ 
          display: 'block', 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          margin: '20px 0'
        }}>
          npm start
        </code>
        <p>The site will be available at <strong>http://localhost:3000</strong></p>
      </div>
    </div>
  );
}
