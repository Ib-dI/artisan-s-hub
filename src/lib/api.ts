import axios from "axios"

const API_URL = 'http://localhost:5000/api' // L'URL du backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// INtercepteur pour ajouter le token aux requêtes si l'utilisateur est connecté
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api