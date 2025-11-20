import { useEffect, useState } from 'react';
import { fetchReviews, type Review } from '../api';

const ReviewDisplayPage = ({ propertyId }: { propertyId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchReviews({ propertyId: propertyId.toString(), selectedOnly: 'true' })
      .then(setReviews)
      .catch((e) => setError(e.message ?? 'Failed to load reviews'))
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) return <p>Loading property and reviews...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto">
      <section className="flex-1">
        {/* Static placeholder for property details */}
        <h1 className="text-3xl font-bold mb-4">Sample Property Title</h1>
        <p className="mb-4">This is a concise description of the property amenities, location and features matching Flex Living style.</p>
        {/* TODO: Add image gallery, map, details */}
      </section>
      <section className="flex-1">
        <h2 className="text-2xl font-semibold mb-4">Guest Reviews</h2>
        {reviews.length === 0 ? (
          <p>No approved reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="border rounded-md p-4 shadow">
                <div className="font-semibold">{r.guestName}</div>
                <small className="text-gray-600">{new Date(r.submittedAt).toLocaleDateString()}</small>
                <p className="mt-2">{r.publicReview}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ReviewDisplayPage;
