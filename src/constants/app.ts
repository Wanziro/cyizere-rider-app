import {IAppConfig} from '../../interfaces';

const APP_MODE = 'dev';
// const APP_MODE = 'production';
const CONFIG = {
  dev: {
    SOCKET_URL: 'http://192.168.43.3:8080',
    BACKEND_URL: 'http://192.168.43.3:8080/api',
    FILE_URL: 'http://192.168.43.3:8080/uploads/',
  },
  production: {
    SOCKET_URL: 'https://apis.cyizere.rw',
    BACKEND_URL: 'https://apis.cyizere.rw/api',
    FILE_URL: 'https://apis.cyizere.rw/uploads/',
  },
};

export const app: IAppConfig = {
  BACKEND_URL: CONFIG[APP_MODE].BACKEND_URL,
  FILE_URL: CONFIG[APP_MODE].FILE_URL,
  SOCKET_URL: CONFIG[APP_MODE].SOCKET_URL,
};
