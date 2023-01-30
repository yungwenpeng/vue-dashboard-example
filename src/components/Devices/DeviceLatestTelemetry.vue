<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, watchEffect } from 'vue';
import store from '../../stores/store';
import RestApiService from '../../services/service';

const props = defineProps({
    deviceId: String,
    deviceName: String,
    socket: WebSocket,
});
const telemetryKeys = ref([]);
const setlastesValue = ref([]);

const getTimeseriesKeys = async (from: String, id: String) => {
    if (store.getters.getAuthUserToken['token'] === null) return;
    const token: any = store.getters.getAuthUserToken['token'];
    const res = await RestApiService.getTimeseriesKeys(id, token);
    console.log(from, '- getTimeseriesKeys - res: ', res.data);
    telemetryKeys.value = res.data;
};

const connect = () => {
    props.socket!.onopen = function () {
        console.log("websocket connected!!");
        let object = {
            tsSubCmds: [{
                entityType: "DEVICE",
                entityId: props.deviceId,
                scope: "LATEST_TELEMETRY",
                cmdId: 10
            }],
            historyCmds: [],
            attrSubCmds: []
        };
        let data = JSON.stringify(object);
        props.socket!.send(data);
    };
    props.socket!.onclose = (event: any) => {
        console.log("Connection is closed!");
    };
    props.socket!.onmessage = async (event: any) => {
        const message = JSON.parse(event.data).data;
        //console.log("message: ", message);
        let data = [] as any;
        if (telemetryKeys.value !== null) {
            if (telemetryKeys.value.length === 0) {
                let keys = [] as any;
                for (let key in message){
                    keys.push(key);
                }
                telemetryKeys.value = keys;
            }
            telemetryKeys.value.forEach(key => {
                //console.log('key: ', key);
                let timestamp = message[key] === undefined ?
                    '' : message[key][0][0];
                let newDate = new Date(timestamp * 1000 / 1000);
                timestamp = newDate.toLocaleString("zh-TW");
                let value = message[key] === undefined ?
                    '' : message[key][0][1];
                data.push(createData(timestamp, key, value));
                setlastesValue.value = data;
                //console.log(key, ':', value, ' , last timestamp: ', timestamp);
            });
        }
        console.log('setlastesValue: ', JSON.stringify(setlastesValue.value));
    };
    props.socket!.onerror = (error: any) => {
        console.log("Connection is error :", error);
    };
}

const createData = (timestamp: any, key: any, value: any) => {
    return { timestamp, key, value };
}

onBeforeMount(() => {
    //console.log(`onBeforeMount - socket.readyState:${props.socket?.readyState}, deviceId: ${props.deviceId?.slice(0, 8)}, setlastesValue: ${JSON.stringify(setlastesValue.value)}`);
    if (props.deviceId !== undefined) {
        //getTimeseriesKeys('onBeforeMount', props.deviceId);
        connect();
    }
});

onBeforeUpdate(() => {
    // WebSocket.CONNECTING = 0, WebSocket.OPEN = 1; 
    //console.log(`onBeforeUpdate - readyState:${props.socket?.readyState}, deviceId: ${props.deviceId}, setlastesValue: ${JSON.stringify(setlastesValue.value)}`);
    if (props.socket?.readyState === WebSocket.CONNECTING) {
        //getTimeseriesKeys('onBeforeUpdate', props.deviceId ?? '');
        connect();
    }
});

/*
onMounted(() => {
    console.log(`onMounted - readyState:${props.socket?.readyState}, deviceId: ${props.deviceId?.slice(0, 8)}`);
});
onUpdated(() => {
    console.log(`onUpdated  - readyState:${props.socket?.readyState}, deviceId: ${props.deviceId?.slice(0, 8)}`);
});
onBeforeUnmount(() => {
    console.log(`onBeforeUnmount - deviceId: ${props.deviceId?.slice(0, 8)}`);
});
onUnmounted(() => {
    console.log(`onUnmounted - deviceId: ${props.deviceId?.slice(0, 8)}`);
});
watchEffect(() => {
    console.log('watchEffect - readyState:', props.socket?.readyState,', deviceId: ', props.deviceId?.slice(0, 8), ', telemetryKeys:', telemetryKeys.value);
});*/

</script>

<template>
    <div>
        <div style="margin: 0.4rem; text-align: start;font-weight: 700;">{{ deviceName }}</div>
        <table>
            <thead>
                <th>Last update time</th>
                <th>Key</th>
                <th>Value</th>
            </thead>
            <tbody v-if="setlastesValue.length > 0">
                <tr v-for="(key, index) in telemetryKeys">
                    <td>{{ setlastesValue[index]["timestamp"] ?? '' }}</td>
                    <td>{{ key }}</td>
                    <td>{{ setlastesValue[index]["value"] ?? '' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
table {
    border-collapse: collapse;
    border-spacing: 0;
    white-space: nowrap;
    text-align: start;
    color: #5a5a5a;
    font-size: 15px;
    width: 100%;
    margin-top: 0.5rem;
}

thead th {
    color: #2559b3;
    font-size: 16px;
    font-weight: 600;
    background: #ced1d3;
    padding: 0.5rem;
}
</style>