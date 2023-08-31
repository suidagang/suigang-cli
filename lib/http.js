import axios from "axios";
import https from 'https';
import { GITHUP_REPOS_URL } from './constant.js'

const agent = new https.Agent({
  rejectUnauthorized: false,
});

axios.interceptors.response.use(res => {
  return res.data;
});

/**
 * 获取模板列表  , { httpsAgent: agent }
 * @returns Promise
 */
 async function getRepoList() {
  return axios.get(`${GITHUP_REPOS_URL}`, { httpsAgent: agent })
}

export {
  getRepoList
}