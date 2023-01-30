export const serverConfig = {
    localhost: 'localhost',
    port: '9090',
};

const wsBaseURL = 'ws://' + serverConfig.localhost + ':' + serverConfig.port;
export const wsFetchTelemetryUrl = wsBaseURL + '/api/ws/plugins/telemetry?token=';