import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Get the path from the query parameters or the request URL
  // Vercel routes like /api/tmdb?path=/movie/1226863
  const { path, ...params } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Path is required' });
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  try {
    const response = await axios.get(`${TMDB_BASE_URL}${path}`, {
      params: {
        ...params,
        api_key: TMDB_API_KEY,
      },
    });

    // Set CORS headers if needed, though Vercel handles this mostly
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.status_message || 'Internal Server Error';
    return res.status(status).json({ error: message });
  }
}
