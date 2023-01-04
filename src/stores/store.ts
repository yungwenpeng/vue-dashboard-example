import { createStore } from 'vuex';

export default createStore({
    state: {
        authToken: { 'token': localStorage.getItem('authToken'), 'refreshToken': localStorage.getItem('refreshToken') } ||
            { 'token': null, 'refreshToken': null }
    },
    getters: {
        getAuthUserToken: (state) => state.authToken,
    },
    mutations: {
        setToken(state, newAuthToken) {
            state.authToken = newAuthToken;
            localStorage.setItem('authToken', newAuthToken['token']);
            localStorage.setItem('authTokenRefresh', newAuthToken['refreshToken']);
        },
        removeToken(state) {
            state.authToken = { 'token': null, 'refreshToken': null };
            localStorage.removeItem("authToken");
            localStorage.removeItem("authTokenRefresh");
        }
    },
    actions: {},
    modules: {}
})