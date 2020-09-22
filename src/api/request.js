import axios from 'axios'
// import store from '@/store'

const requestHandler = config => {
  config.crossDomain = true;
  config.method = 'GET';
  return config
};

const request = axios.create();
request.interceptors.request.use(requestHandler);

export default request
