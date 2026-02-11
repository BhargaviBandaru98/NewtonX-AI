// server-entry.js
import 'dotenv/config';  // <- loads .env BEFORE anything else
import './server.js';    // now server.js and all imports see env variables
