import axios from 'axios'

class AxiosService {
  constructor() {
    this.token = localStorage.getItem('token')
    this.initialUrl = 'http://localhost:5000/api'
  }

  updateToken() {
    this.token = localStorage.getItem('token')
  }

  async get(path) {
    this.updateToken()
    try {
      const res = await axios.get(this.initialUrl + path, {
        headers: { authorization: `Bearer ${this.token}` },
        withCredentials: true
      });

      return res.data
    } catch (e) {
      return e.response.data
    }
  }

  async post(path, body) {
    this.updateToken()
    console.log(this.initialUrl)
    try {
      const res = await axios.post(this.initialUrl + path, body, {
        headers: { authorization: `Bearer ${this.token}` },
        withCredentials: true
      });

      return res.data
    } catch (e) {
      return e.response.data
    }
  }

  async getConversations() {
    this.updateToken()
    const responseData = await this.get('/conversations');

    if (responseData.status === 'error') {
      console.log(responseData)
      return []
    }

    const sortedConversations = responseData.data.conversations.sort(
      (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    return sortedConversations
  }
}

export const axiosService = new AxiosService()