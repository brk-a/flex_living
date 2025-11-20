import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export interface ReviewCategory {
  category: string;
  rating: number | null;
}

export interface Review {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

// Centralised axios error handling
function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const message = error.response.data?.message || `API Error: ${error.response.status} ${error.response.statusText}`;
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error: No response received from server.');
    } else {
      throw new Error(`Axios error: ${error.message}`);
    }
  }
  throw new Error('Unexpected error occurred');
}

export async function fetchReviews(filters: Record<string, string> = {}): Promise<Review[]> {
  const params = new URLSearchParams(filters);
  try {
    const response = await axios.get<{ status: string; result: Review[] }>(
      `${API_BASE}/reviews/hostaway?${params.toString()}`
    );
    return response.data.result;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function markReviewSelected(reviewId: number, listingName: string): Promise<void> {
  try {
    await axios.post(`${API_BASE}/reviews/selection`, { reviewId, listingName });
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function unmarkReviewSelected(reviewId: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE}/reviews/selection/${reviewId}`);
  } catch (error) {
    handleAxiosError(error);
  }
}
