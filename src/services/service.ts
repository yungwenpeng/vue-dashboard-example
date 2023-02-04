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
    //Returns a page of assets info objects owned by tenant.
    getTenantAssetInfos(token: any): Promise<any> {
        return axios.get(
            '/api/tenant/assetInfos?pageSize=100&page=0&type=Floor',
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
    //Returns a page of assets info objects assigned to customer.
    getCustomerAssetInfos(id: any, token: any): Promise<any> {
        return axios.get(
            '/api/customer/' + id + '/assetInfos?pageSize=100&page=0&type=Floor',
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
    //Returns list of relation info objects for the specified entity by the 'from' direction.
    findRelationInfoByFrom(fromId: any, fromType: any, token: any): Promise<any> {
        return axios.get(
            '/api/relations/info?fromId=' + fromId + '&fromType=' + fromType,
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
    //Requested assets must be owned by tenant or assigned to customer which user is performing the request.
    getAssetsByIds(assetIds: any, token: any): Promise<any> {
        return axios.get(
            '/api/assets?assetIds=' + assetIds,
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
    //Returns all attributes that belong to specified entity.
    getAttributes(entityId: any, entityType: any, keys: any, token: any): Promise<any> {
        return axios.get(
            '/api/plugins/telemetry/' + entityType + '/' + entityId + '/values/attributes?keys=' + keys,
            {
                headers: {
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
    //Creates or updates the device attributes based on device id and specified attribute scope.
    saveDeviceAttributes(deviceId: any, data: any, token: any): Promise<any> {
        return axios.post(
            '/api/plugins/telemetry/' + deviceId + '/SHARED_SCOPE',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }
        );
    };
}

export default new RestApiService();