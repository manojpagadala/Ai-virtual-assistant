import React, { useEffect, useState } from 'react';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        setNews(response.data);
        setError('');
      } catch (error) {
        setError('Failed to fetch news data');
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <h1>Latest News</h1>
      {news.map((article, index) => (
        <div key={index} className="news-article">
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
            Read more
          </a>
        </div>
      ))}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default News;