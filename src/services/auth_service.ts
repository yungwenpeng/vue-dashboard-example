import axios from '../utils/axios';

class RestApiService {
    login(data: any): Promise<any> {
        return axios.post(
            '/api/auth/login',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
    };
}

export default new RestApiService();