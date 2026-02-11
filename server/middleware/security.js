import helmet from 'helmet';
import express from 'express';

export const securityMiddleware = () => {
  return [
    helmet(), // Sets various HTTP headers for security
    express.json({ limit: '10kb' }), // Limit body payload size
    express.urlencoded({ extended: true, limit: '10kb' }),
  ];
};

export default securityMiddleware;