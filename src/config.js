const API_BASE_URL = typeof process !== 'undefined' && process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL 
  : 'http://157.66.191.31:30151';

  // const API_BASE_URL = typeof process !== 'undefined' && process.env.REACT_APP_API_URL 
  // ? process.env.REACT_APP_API_URL 
  // : 'http://localhost:8000';

export default API_BASE_URL;
