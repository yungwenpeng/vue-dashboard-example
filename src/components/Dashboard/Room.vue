<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue';
import store from "../../stores/store";
import RestApiService from '../../services/service';
import { wsFetchTelemetryUrl } from '../../utils/websocket';
import notifyStatusImagesUrl from '../../../src/assets/warnning_icon.png';
import temperatureImageUrl from '../../../src/assets/medium-temperature-icon.png';
import highTemperatureImageUrl from '../../../src/assets/high-temperature-warn-icon.png';
import humidityImageUrl from '../../../src/assets/humidity-icon.png';
import detailsImageUrl from '../../../src/assets/upload-image-icon.png';
import { GChart } from "vue-google-charts";
import { chartOptions } from './GoogleChartData';

const props = defineProps({
    floorId: String,
    roomId: String,
});

const windowHeight = ref(0);
const roomName = ref('' as String);
const deviceList = ref([] as any);
const socket = ref({} as WebSocket);
const setlastesValue = ref([] as any);
const isDisplayHistory = ref(false as Boolean);
const maxLineChartCount = 12;
const chartData = ref([] as any);

const createTelemetryData = (timestamp: any, key: any, value: any) => {
    return { timestamp, key, value };
};

const createFirstLineChartData = (keys: any) => {
    chartData.value = [keys,];
};

const checkLineChartData = (() => {
    if(chartData.value.length > maxLineChartCount) {
        chartData.value.splice(1, 1);
    }
});

const connect = (deviceId: any) => {
    socket.value.onopen = function () {
        console.log("(Room)websocket connected!!");
        let object = {
            tsSubCmds: [{
                entityType: "DEVICE",
                entityId: deviceId,
                scope: "LATEST_TELEMETRY",
                cmdId: 10
            }],
            historyCmds: [],
            attrSubCmds: []
        };
        let data = JSON.stringify(object);
        socket.value.send(data);
    };
    socket.value.onclose = (event: any) => {
        console.log("(Room)Connection is closed!");
    };
    socket.value.onmessage = async (event: any) => {
        const message = JSON.parse(event.data).data;
        //console.log("message: ", message);
        let data = [] as any;
        let keys = ["Timestamp"] as any;
        let chartTempData = [] as any;
        for (let key in message) {
            //console.log(`message: ${key} - ${message[key][0]}`);
            let value = message[key][0][1];
            let timestamp = message[key][0][0];
            let newDate = new Date(timestamp * 1000 / 1000);
            timestamp = newDate.toLocaleTimeString("en-GB");
            data.push(createTelemetryData(timestamp, key, value));
            keys.push(key[0].toUpperCase() + key.slice(1));
            setlastesValue.value = data;
        }

        if (chartData.value.length === 0) { createFirstLineChartData(keys); }
        if (data.length > 0) {
            chartTempData.push(data[0]['timestamp']);
            data.forEach((item: any) => { chartTempData.push(parseFloat(item['value'])); })
        }
        chartData.value.push(chartTempData);
        checkLineChartData();
        //console.log("chartData.value: ", chartData.value);
        console.log("(Room)setlastesValue: ", JSON.stringify(setlastesValue.value));
    };
    socket.value.onerror = (error: any) => {
        console.log("(Room)Connection is error :", error);
    };
};

const getRoomName = async () => {
    const token: any = store.getters.getAuthUserToken['token'];
    RestApiService.getAssetsByIds(props.roomId, token)
        .then((res) => {
            //console.log(`getRoomName - res: ${JSON.stringify(res.data)}`);
            roomName.value = res.data[0]['name']
        });
};

const getRoomRelationInfos = async () => {
    const token: any = store.getters.getAuthUserToken['token'];
    RestApiService.findRelationInfoByFrom(props.roomId, 'ASSET', token)
        .then((res) => {
            //console.log(`getRoomRelationInfos - res: ${JSON.stringify(res.data)}`);
            let devicesData = [] as any;
            res.data.forEach((device: any) => {
                //console.log(`getRoomRelationInfos - device: ${JSON.stringify(device)}`);
                console.log(`getRoomRelationInfos - device: ${device['toName']}, ${device['to']['id']}`);
                devicesData.push(createDeviceData(device['to']['id'], device['toName']));
                socket.value = new WebSocket(wsFetchTelemetryUrl + token);
                connect(device['to']['id']);
            });
            deviceList.value = devicesData;
        });
};

const createDeviceData = (deviceId: String, deviceName: String) => {
    return { deviceId, deviceName }
};
const resizeWindow = () => {
    windowHeight.value = window.innerHeight - 60;
}

onBeforeMount(async () => {
    //console.log(`onBeforeMount - ${props.floorId}`);
    getRoomName();
    getRoomRelationInfos();
});
onMounted(() => {
    window.addEventListener('resize', resizeWindow);
    resizeWindow();
});

//Press Back to floor
//Refer to : https://segmentfault.com/q/1010000040726106
onBeforeRouteLeave((to, from) => {
    console.log(`Room - onBeforeRouteLeave - device:${deviceList.value.length},  to:${to['path']}`);
    if (deviceList.value.length > 0) {
        socket.value.close();
    }
});
onUnmounted(() => {
    //console.log(`Room - onUnmounted`);
    window.removeEventListener('resize', resizeWindow);
});

</script>

<template>
    <div class="container-fluid" :style="{
        'max-height': `${windowHeight}px`,
        'overflow-y': `auto`
    }">
        <div class="main-container">
            <div class="roomId">{{ roomName }}</div>
            <div v-if="deviceList.length > 0">
                <div class="roomId">
                    <span style="font-size:15px;">Device name: </span>
                    <span style="font-size:15px;" v-for="device in deviceList">
                        {{ device['deviceName'] }} &nbsp;
                    </span>
                </div>
                <div class='noteDiv' v-if="setlastesValue.length > 0 && setlastesValue[1]['value'] > 27"
                    :style="{ 'background-image': 'url(' + notifyStatusImagesUrl + ')' }"></div>
                <div class='infos row col-11 mx-auto'>
                    <div class='detail-image col'>
                        <input id="upload" :style="{ 'display': 'none' }" type="file" accept=".png, .jpg, .jpeg">
                        <div class='detailInfoPhoto'>
                            <input id="upload" style="display:none" type="file" accept=".png, .jpg, .jpeg" />
                            <img :src="detailsImageUrl" :style="{ 'width': '128px', 'height': '128px' }"
                                title="Upload your photos" alt="Upload your photos" />
                        </div>
                    </div>
                    <div class='temperature col'>
                        <div class='temperatureIcon' v-if="setlastesValue.length > 0 && setlastesValue[1]['value'] > 27"
                            :style="{ 'background-image': 'url(' + highTemperatureImageUrl + ')' }">
                        </div>
                        <div class='temperatureIcon' v-else
                            :style="{ 'background-image': 'url(' + temperatureImageUrl + ')' }">
                        </div>
                        <div class='temperatureWord' v-if="setlastesValue.length > 0">
                            <p v-if="setlastesValue[1]['value'] > 27" style="color: #ed250e;">
                                {{ setlastesValue[1]['value'] }} °C
                            </p>
                            <p v-else style="color: #1c1b1b;"> {{ setlastesValue[1]['value'] }} °C</p>
                        </div>
                    </div>
                    <div class='humidity col'>
                        <div class='humidityIcon' :style="{ 'background-image': 'url(' + humidityImageUrl + ')' }">
                        </div>
                        <div class='humidityWord' v-if="setlastesValue.length > 0">
                            <p>{{ setlastesValue[0]['value'] }} %</p>
                        </div>
                    </div>
                </div>
                <div class='linechart-card col-10 mx-auto'>
                    <GChart type="LineChart" :data="chartData" :options="chartOptions" style="height:320px;" />
                </div>
                <div class="mx-auto col-xs-12 col-sm-10 col-md-10">
                    <div class="d-grid gap-2 col-10 mx-auto">
                        <button type="button" class="btn btn-secondary btn-lg">
                            {{ isDisplayHistory? 'Hide alarm event hsitory': 'Alarm event hsitory' }}
                        </button>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="roomId"><span style="font-size:15px;">No Device</span></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-fluid {
    caret-color: transparent;
}

.main-container {
    position: relative;
    margin: 0;
    padding: 10px;
    border-radius: 10px;
    max-width: 800px;
    background-image: linear-gradient(135deg, #d6f1e9 10%, #08e979 100%);
}

.roomId {
    font-size: 20px;
    font-weight: bold;
    position: relative;
}

.noteDiv {
    position: absolute;
    width: 30px;
    height: 30px;
    right: 20px;
    top: 10px;
    z-index: 10;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.row {
    display: flex;
    flex-wrap: wrap;
}

.detail-image {
    flex-grow: 2;
    margin: 15px;
    column-width: auto;
}

.detailInfoPhoto {
    max-height: 144px;
    padding: 5px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.temperature,
.col {
    flex-grow: 1;
    margin: 15px auto;
    column-width: auto;
}

.temperatureIcon,
.humidityIcon {
    height: 80px;
    margin: 30px auto;
    font-weight: bold;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.temperatureWord,
.humidityWord {
    height: 12%;
    text-align: center;
    font-weight: bold;
    position: relative;
}

.linechart-card {
    flex-grow: 1;
    margin: 10px auto;
    padding: 2px;
    position: relative;
    border-radius: 20px;
    border-style: double;
    justify-content: center;
    border-color: rgb(49, 49, 49);
}
</style>