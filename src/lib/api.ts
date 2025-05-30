import axios from "axios";

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
    try {
      const storedUser = localStorage.getItem('user');
      console.log('Stored user:', storedUser);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('Parsed user:', user);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log('Token ajouté aux headers:', config.headers.Authorization);
          console.log('URL de la requête:', config.url);
          console.log('Méthode de la requête:', config.method);
          console.log('Headers complets:', config.headers);
          
          // Décoder le token pour vérifier son contenu
          try {
            const tokenParts = user.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Contenu du token:', {
                id: payload.id,
                role: payload.role,
                exp: new Date(payload.exp * 1000)
              });
            }
          } catch (e) {
            console.error('Erreur lors du décodage du token:', e);
          }
        } else {
          console.log('Pas de token trouvé dans les données utilisateur');
        }
      } else {
        console.log('Pas d\'utilisateur trouvé dans le localStorage');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Erreur d\'authentification complète:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      // Afficher le message d'erreur du backend
      console.error('Message d\'erreur du backend:', error.response?.data?.message || 'Pas de message d\'erreur');
      
      // Vérifier si le token est expiré
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('État actuel de l\'utilisateur:', {
          id: user._id,
          role: user.role,
          hasToken: !!user.token
        });
        
        if (user?.token) {
          try {
            const tokenParts = user.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('Payload du token:', payload);
              console.log('Expiration du token:', new Date(payload.exp * 1000));
              console.log('Rôle de l\'utilisateur dans le token:', payload.role);
              console.log('Rôle de l\'utilisateur dans le state:', user.role);
            }
          } catch (e) {
            console.error('Erreur lors du décodage du token:', e);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api