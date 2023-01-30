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
    getTenantAllDevices(token: any): Promise<any> {
        return axios.get(
            '/api/tenant/deviceInfos?pageSize=100&page=0&sortProperty=name',
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
    getCustomerAllDevices(id: any, token: any): Promise<any> {
        return axios.get(
            '/api/customer/' + id + '/deviceInfos?pageSize=100&page=0&sortProperty=name',
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
    //Returns a set of unique time-series key names for the selected entity.
    //Response : [ "temperature", "humidity" ]
    getTimeseriesKeys(id: any, token: any): Promise<any> {
        return axios.get(
            '/api/plugins/telemetry/DEVICE/' + id + '/keys/timeseries',
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
}

export default new RestApiService();