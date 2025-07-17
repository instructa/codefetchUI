import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexRoute,
});

function IndexRoute() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApiData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Comment out auto-fetch for now
  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Route with API Integration 🎉</h1>
      <p>This page demonstrates calling a minimal API endpoint</p>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={fetchData}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh API Data'}
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>API Response:</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {apiData && (
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(apiData, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9em', color: '#666' }}>
        <strong>Current time:</strong> {new Date().toLocaleString()}
      </div>
    </div>
  );
}
