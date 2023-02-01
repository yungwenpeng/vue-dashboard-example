<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUnmounted } from 'vue';
import store from "../../stores/store";
import RestApiService from '../../services/service';
import { wsFetchTelemetryUrl } from '../../utils/websocket';

const props = defineProps({
    floorId: String,
});

const relationsRoomList = ref([] as any);
const socket = ref({} as WebSocket);
const setlastesValue = ref([]);

const connect = (deviceId: any) => {
    socket.value.onopen = function () {
        console.log("websocket connected!!");
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
        console.log("Connection is closed!");
    };
    socket.value.onmessage = async (event: any) => {
        const message = JSON.parse(event.data).data;
        //console.log("message: ", message);
        let data = [] as any;
        for (let key in message) {
            //console.log(`message: ${key} - ${message[key][0]}`);
            let value = message[key][0][1];
            data.push(createTelemetryData(key, value));
            setlastesValue.value = data;
        }
        console.log("setlastesValue: ", JSON.stringify(setlastesValue.value));
    };
    socket.value.onerror = (error: any) => {
        console.log("Connection is error :", error);
    };
}

const mouseEnter = (devices: any) => {
    //console.log(`mouseEnter - ${JSON.stringify(devices)}`);
    const token: any = store.getters.getAuthUserToken['token'];
    socket.value = new WebSocket(wsFetchTelemetryUrl + token);
    devices.forEach((device: any) => {
        //console.log(`device:${device['deviceName']}, ${device['deviceId'].slice(0,8)}`)
        connect(device['deviceId']);
    });
};
const mouseLeave = () => {
    //console.log(`mouseLeave`);
    socket.value.close();
};

const createTelemetryData = (key: any, value: any) => {
    return { key, value };
}

const createDeviceData = (deviceId: String, deviceName: String) => {
    return { deviceId, deviceName }
};
const createData = (roomId: String, roomName: String, devices: any) => {
    return { roomId, roomName, devices };
};

const getRoomRelationInfos = async (roomId: any, roomName: any) => {
    // get device info in room
    const token: any = store.getters.getAuthUserToken['token'];
    RestApiService.findRelationInfoByFrom(roomId, 'ASSET', token)
        .then((res: any) => {
            //console.log('getRoomRelationInfos: ', res.data);
            let dataAscending = [] as any;
            dataAscending = [...res.data].sort((a, b) =>
                b['toName'] > a['toName'] ? -1 : 1,
            );
            let devicesData = [] as any;
            dataAscending.forEach((rel: any) => {
                devicesData.push(createDeviceData(rel['to']['id'], rel['toName']))
            });
            //console.log('getRoomRelationInfos: ', devicesData);
            relationsRoomList.value.push(createData(roomId, roomName, devicesData));
        });
};

const getFloorRelationInfos = async (fromId: any) => {
    // get all room info
    const token: any = store.getters.getAuthUserToken['token'];
    RestApiService.findRelationInfoByFrom(fromId, 'ASSET', token)
        .then(res => {
            //console.log('getFloorRelationInfos: ', res.data);
            res.data.forEach((rel: any) => {
                getRoomRelationInfos(rel['to']['id'], rel['toName']);
            });
        });
}

onBeforeMount(async () => {
    //console.log(`onBeforeMount - ${props.floorId}`);
    getFloorRelationInfos(props.floorId);
});
onBeforeUpdate(() => {
    let dataAscending = [] as any;
    dataAscending = [...relationsRoomList.value].sort((a, b) =>
        b['roomName'] > a['roomName'] ? -1 : 1,
    );
    relationsRoomList.value = dataAscending;
    //console.log(`onBeforeUpdate - relationsRoomList:${JSON.stringify(relationsRoomList.value)}`);
});

// For card scrollable : style need add "max-height" & "overflow-y:auto"
// https://stackoverflow.com/questions/51692031/set-height-of-a-div-in-vue-js
let windowHeight = ref(0);
function resizeWindow() {
    windowHeight.value = window.innerHeight - 100;
}
onMounted(() => {
    window.addEventListener('resize', resizeWindow);
    resizeWindow();
});
onUnmounted(() => {
    window.removeEventListener('resize', resizeWindow);
});

</script>

<template>
    <!-- Dynamic Route Matching with Params
         https://router.vuejs.org/guide/essentials/dynamic-matching.html 
         <div>Floor {{ $route.params.id }}</div>  -->
    <div class="card" v-if="relationsRoomList.length > 0">
        <h5 class="card-header text-white bg-info">Floor id: {{ floorId }}</h5>
        <div class="main-area" :style="{
            'max-height': `${windowHeight}px`,
            'overflow-y': `auto`
        }">
            <div v-for="roomInfo in relationsRoomList">
                <div class="main-content card mb-3">
                    <div class="door-hor"></div>
                    <div class="window-hor"></div>
                    <div class="bed">
                        <div class="table"></div>
                        <div class="blanket"></div>
                        <div class="pillow"></div>
                        <div class="pillow"></div>
                        <div class="bi bi-thermometer-half" v-if="roomInfo['devices'].length > 0"
                            @mouseenter="mouseEnter(roomInfo['devices'])" @mouseleave="mouseLeave">
                            <div class="overlay" v-for="device in roomInfo['devices']">
                                Device: {{ device['deviceName'] }}<br>
                                {{
                                    setlastesValue.length > 0 ? ((setlastesValue[1]['key'][0] as String).toUpperCase() +
                                        (setlastesValue[1]['key'] as String).slice(1) + ': ' + setlastesValue[1]['value'] +
                                        '°C')
                                        : ''
                                }}<br>
                                {{
                                    setlastesValue.length > 0 ? ((setlastesValue[0]['key'][0] as String).toUpperCase() +
                                        (setlastesValue[0]['key'] as String).slice(1) + ': ' + setlastesValue[0]['value']
                                        + '%')
                                        : ''
                                }}
                            </div>
                        </div>
                    </div>
                    <div class="bathroom">
                        <div class="door-hor"></div>
                        <div class="shower"></div>
                        <div class="toilet"></div>
                        <div class="vanity"></div>
                    </div>
                    <div class="name">{{(roomInfo['roomName'] as String).substring(5)}}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="card" v-else>
        <h5 class="card-header text-white bg-info">Floor id: {{ floorId }}</h5>
        <h6> No any item</h6>
    </div>
</template>

<style scoped>
.main-area {
    display: grid;
    grid-template-columns: repeat(auto-fill, 320px);
    grid-column-gap: 2rem;
}

.main-content {
    margin: 15px;
    min-width: 320px;
    min-height: 200px;
    border: 4px solid #096b72;
    border-width: 4px;
    position: relative;
    caret-color: transparent;
}

.main-content>div {
    position: relative;
}

.main-content>.door-hor {
    top: -4px;
    left: 15px;
}

.main-content .window-hor {
    left: 120px;
    width: 120px;
}

.main-content .bed .pillow {
    height: 35px;
    top: 8px;
    right: 15px;
}

.main-content .bed .pillow:nth-child(3) {
    bottom: 8px;
    top: auto;
}

.main-content .bathroom {
    position: absolute;
    bottom: 0px;
    border: 4px solid #096b72;
    width: 100px;
    height: 120px;
    border-width: 4px 4px 0 0;
}

.bathroom .door-hor {
    top: -4px;
    left: 5px;
    transform: rotate(0deg);
}

/*utilities*/
.door-hor {
    position: absolute;
    background: #fff;
    width: 45px;
    height: 35px;
    overflow: hidden;
    z-index: 10;
}

.door-hor:before {
    content: "";
    position: absolute;
    background: #fff;
    width: 6px;
    height: 31px;
    border: 1px solid #096b72;
}

.door-hor:after {
    content: "";
    position: absolute;
    width: inherit;
    height: 80px;
    width: 130px;
    right: -1px;
    bottom: -0.5px;
    border-radius: 50%;
    border: 1px solid #096b72;
}

.window-hor {
    position: absolute;
    top: -45px;
    height: 15px;
    border: 2px solid #445770;
    width: 80px;
    background: #3583eb;
    z-index: 10;
}

.bed {
    width: 180px;
    height: 100px;
    position: absolute;
    border: 2px solid #096b72;
    left: 130px;
    top: 40px;
    border-radius: 8px 0 0 8px;
    background: #fff;
}

.bed .blanket {
    width: 55%;
    left: 0;
    position: absolute;
    top: 0;
    height: 100%;
    border-right: 2px solid #096b72;
    background: repeating-linear-gradient(to right, transparent, transparent 6px, rgba(9, 107, 114, 0.5) 6px, rgba(9, 107, 114, 0.5) 8px), repeating-linear-gradient(to bottom, transparent, transparent 6px, rgba(9, 107, 114, 0.5) 6px, rgba(9, 107, 114, 0.5) 8px);
}

.bed .blanket:before {
    content: "";
    position: absolute;
    right: -18px;
    width: 0;
    height: 100%;
    border-right: 2px solid #096b72;
}

.bed .pillow {
    width: 25px;
    border: 2px solid #096b72;
    height: 40px;
    border-radius: 6px;
    right: 8px;
    top: 14px;
    position: absolute;
    background: #ffc107;
}

.shower {
    width: 55px;
    height: 50px;
    position: absolute;
    border: 2px solid #096b72;
    bottom: -2px;
    right: -2px;
    border-radius: 2000% 0 0 0%;
}

.shower:before {
    content: "";
    position: absolute;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    border: 1px solid #096b72;
    right: 6px;
    bottom: 6px;
}

.vanity {
    width: 30px;
    height: 60px;
    position: absolute;
    border: 2px solid #096b72;
    bottom: 20px;
    left: -2px;
}

.vanity:before {
    content: "";
    position: absolute;
    border: 1px solid #096b72;
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px #096b72;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    top: 20px;
    left: 50%;
    margin-left: -7.5px;
}

.toilet {
    width: 30px;
    height: 8px;
    position: absolute;
    border: 2px solid #096b72;
    top: 20px;
    right: -10px;
    transform: rotate(-90deg);
}

.toilet:after {
    content: "";
    position: absolute;
    border: 2px solid #096b72;
    height: 22px;
    width: 23px;
    border-radius: 20px 20px 0 0;
    top: -26px;
    left: 50%;
    margin-left: -12px;
}

.table {
    width: 40px;
    height: 90px;
    top: -93px;
    right: -3px;
    position: absolute;
    border: 2px solid #096b72;
}

.table:before {
    content: "";
    position: absolute;
    border: 2px solid #096b72;
    width: 18px;
    height: 25px;
    top: 30px;
    left: -35%;
    margin-left: -10px;
    border-radius: 40px 0 0 40px;
    background: linear-gradient(to left, transparent 0, transparent 50%, #096b72 50%, #096b72 60%, transparent 60%);
}

.main-content:hover {
    border-radius: 20px 20px 20px 20px;
    border: 8px solid #df28b7;
}

.name {
    position: absolute;
    height: 30px;
    text-align: center;
    font-weight: bold;
    font-size: 25px;
    padding: 0;
    bottom: 130px;
}

.main-content:hover .name {
    font-size: 36px;
    color: #df28b7;
}

.bi-thermometer-half {
    position: absolute;
    color: #000000;
    border: 2px solid rgb(242, 247, 183);
    border-radius: 15px;
    top: -20px;
    left: -30px;
    height: 30px;
    width: 30px;
    background: rgb(242, 247, 183);
    text-align: center;
    font-size: 18px;
}

.bi-thermometer-half:hover {
    position: absolute;
    color: #2937f8;
    border: 3px solid rgb(236, 190, 241);
    background: rgb(236, 190, 241);
    height: 34px;
    width: 34px;
    text-align: center;
    font-size: 20px;
}

.overlay {
    position: absolute;
    margin: 10px;
    padding: 5px;
    width: 500%;
    transition: .5s ease;
    opacity: 0;
    color: rgb(0, 0, 0);
    font-size: 12px;
    text-align: left;
    font-weight: bold;
    display: inline-flex;
    background-color: rgb(236, 190, 241);
}

.bi-thermometer-half:hover .overlay {
    opacity: 0.9;
}
</style>