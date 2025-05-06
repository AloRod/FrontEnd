import axios from 'axios';
//conexion con graphql 
class GraphQLClient {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://127.0.0.1:5000/graphql';
  }

  async query(queryString, variables = {}) {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found, please log in.');
    }
    
    try {
      const response = await axios.post(
        this.baseURL,
        {
          query: queryString, //recibe el query del RestrictedUserHome
          variables: variables
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data;
    } catch (error) {
      console.error('GraphQL Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new GraphQLClient();