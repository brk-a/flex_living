import './App.css';
import { useState } from 'react';
import ReviewsDashBoard from './components/ReviewDashBoard';
import ReviewsDisplayPage from './components/ReviewsDisplayPage';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  // For demo, I will toggle page via state; in real app I will use react-router
  const [propertyId, _] = useState<number | null>(1);
  const [viewDashboard, setViewDashboard] = useState(false);

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            className="mr-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setViewDashboard(false)}
          >
            Property & Reviews
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded"
            onClick={() => setViewDashboard(true)}
          >
            Reviews Dashboard
          </button>
        </div>

        {viewDashboard ? (
          <ReviewsDashBoard />
        ) : propertyId ? (
          <ReviewsDisplayPage propertyId={propertyId} />
        ) : (
          <p>Select a property to view.</p>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
