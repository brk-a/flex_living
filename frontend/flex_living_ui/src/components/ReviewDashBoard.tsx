import { useEffect, useState } from 'react'
import { fetchReviews, markReviewSelected, unmarkReviewSelected, type Review } from '../api'

interface Filters {
  rating: string
  category: string
  channel: string
  from: string
  to: string
  selectedOnly: string
  [key: string]: string
}

const ReviewsDashboard: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filters, setFilters] = useState<Filters>({
    rating: '',
    category: '',
    channel: '',
    from: '',
    to: '',
    selectedOnly: 'false',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchReviews(filters)
      .then(setReviews)
      .catch(e => setError(e.message ?? 'Unexpected error'))
      .finally(() => setLoading(false))
  }, [filters])

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  async function toggleSelection(review: Review) {
    try {
      if (filters.selectedOnly === 'true') {
        await unmarkReviewSelected(review.id)
      } else {
        await markReviewSelected(review.id, review.listingName)
      }
      const updatedReviews = await fetchReviews(filters)
      setReviews(updatedReviews)
    } catch {
      setError('Failed to update selection')
    }
  }

  if (loading) return <p>Loading reviews...</p>

  return (
    <div className="flex flex-col p-4 border rounded-md">
      {/* Error message */}
      {error && (
        <div className="text-red-600 mb-4">
          <p>Error: {error}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchReviews(filters)
                .then(setReviews)
                .catch(e => setError(e.message ?? 'Unexpected error'))
                .finally(() => setLoading(false))
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select name="rating" value={filters.rating} onChange={handleFilterChange} className="border rounded p-2">
          <option value="">All Ratings</option>
          <option value="10">10</option>
          <option value="9">9</option>
          <option value="8">8</option>
        </select>

        <select name="category" value={filters.category} onChange={handleFilterChange} className="border rounded p-2">
          <option value="">All Categories</option>
          <option value="cleanliness">Cleanliness</option>
          <option value="communication">Communication</option>
          <option value="respect_house_rules">Respect House Rules</option>
        </select>

        <select name="channel" value={filters.channel} onChange={handleFilterChange} className="border rounded p-2">
          <option value="">All Channels</option>
          <option value="host-to-guest">Host to Guest</option>
          <option value="guest-to-host">Guest to Host</option>
        </select>

        <input type="date" name="from" value={filters.from} onChange={handleFilterChange} className="border rounded p-2" placeholder="From Date" />
        <input type="date" name="to" value={filters.to} onChange={handleFilterChange} className="border rounded p-2" placeholder="To Date" />

        <select name="selectedOnly" value={filters.selectedOnly} onChange={handleFilterChange} className="border rounded p-2">
          <option value="false">All Reviews</option>
          <option value="true">Selected Only</option>
        </select>
      </div>

      {/* Reviews listing */}
      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="border p-3 rounded shadow">
            <div>
              <strong>{r.guestName}</strong> - <em>{r.listingName}</em>
            </div>
            <p>{r.publicReview}</p>
            <button
              onClick={() => toggleSelection(r)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-800"
            >
              {filters.selectedOnly === 'true' ? 'Unselect' : 'Select'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReviewsDashboard
