<script lang="ts">
import { defineComponent } from "vue";
import store from "../../stores/store";
import jwtDecode from "jwt-decode";
import RestApiService from '../../services/service';
import DeviceLatestTelemetry from './DeviceLatestTelemetry.vue';
import { wsFetchTelemetryUrl } from '../../utils/websocket';

export default defineComponent({
    name: 'DeviceList',
    components: {
        DeviceLatestTelemetry,
    },
    data() {
        return {
            fields: ['ID', 'Name', 'Device Profile', 'Label', 'Customer'],
            devices: [] as {
                id: string,
                name: string,
                profile: string,
                label: string,
                customer: string,
                softwareId: string,
                firmwareId: string
            }[],
            selectedDevice: {} as {
                id: string,
                name: string,
                profile: string,
                label: string,
                customer: string,
                softwareId: string,
                firmwareId: string
            },
            socket: {} as WebSocket,
        };
    },
    created() {
        if (store.getters.getAuthUserToken['token'] === null) return;
        const decoded: any = jwtDecode(store.getters.getAuthUserToken['token']);
        const token: any = store.getters.getAuthUserToken['token'];
        //console.log('getDevices - decoded:', decoded);
        if (decoded['scopes'][0] === 'TENANT_ADMIN') {
            RestApiService.getTenantAllDevices(token)
                .then(res => {
                    const data: any = res.data.data;
                    this.pushAllDevices('TENANT', data);
                    console.log('getDevices(TENANT) - devices:', this.devices);
                });
        } else if (decoded['scopes'][0] === 'CUSTOMER_USER') {
            RestApiService.getCustomerAllDevices(decoded['customerId'], token)
                .then(res => {
                    const data: any = res.data.data;
                    this.pushAllDevices('USER', data);
                    console.log('getDevices(USER) - devices:', this.devices);
                });
        }
    },
    mounted() {
        const myOffcanvas = document.getElementById('deviceDetail');
        myOffcanvas?.addEventListener('hide.bs.offcanvas', event => {
            console.log('hide.bs.offcanvas');
            this.socket.close();
        });
        myOffcanvas?.addEventListener('show.bs.offcanvas', event => {
            console.log('show.bs.offcanvas');
            const token: any = store.getters.getAuthUserToken['token'];
            this.socket = new WebSocket(wsFetchTelemetryUrl + token);
            //console.log('show.bs.offcanvas: this.socket: ', this.socket);
        });
    },
    beforeUnmount(){
        //console.log('beforeUnmount');
        this.socket.close();
    },
    methods: {
        pushAllDevices(role: String, data: any) {
            data.forEach((element: any) => {
                //console.log('getDevices(', role, ') - element:', element);
                this.devices.push({
                    id: element['id']['id'],
                    name: element['name'],
                    profile: element['deviceProfileName'],
                    label: element['label'],
                    customer: element['customerTitle'],
                    softwareId: element['softwareId'],
                    firmwareId: element['firmwareId']
                });
            });
        },
        selectDevice(device: any) {
            this.selectedDevice = device;
            //console.log('selectedDevice:', this.selectedDevice);
        },
    },
});
</script>

<template>
    <div class="table-responsive">
        <table>
            <thead>
                <th v-for="field in fields">{{ field }}</th>
            </thead>
            <tbody v-if="devices.length > 0">
                <tr v-for="device in devices" @click="selectDevice(device)" data-bs-toggle="offcanvas"
                    data-bs-target="#deviceDetail" aria-controls="deviceDetail">
                    <td>{{ device['id'] }}</td>
                    <td>{{ device['name'] }}</td>
                    <td>{{ device['profile'] }}</td>
                    <td>{{ device['label'] }}</td>
                    <td>{{ device['customer'] }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="offcanvas offcanvas-end text-bg-light" tabindex="-1" id="deviceDetail"
        aria-labelledby="offcanvasDarkNavbarLabel" style="min-width: 40%;">
        <div class="offcanvas-body" v-if="selectedDevice.id">
            <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-details"
                        type="button" role="tab" aria-controls="nav-details" aria-selected="true">Details</button>
                    <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-telemetry"
                        type="button" role="tab" aria-controls="nav-telemetry" aria-selected="false">Latest
                        telemetry</button>
                </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-details" role="tabpanel"
                    aria-labelledby="nav-details-tab" tabindex="0">
                    <div v-for="(item, key) in selectedDevice">
                        <blockquote class="blockquote">
                            <p>{{ key.toLocaleUpperCase() }}</p>
                        </blockquote>
                        <figcaption class="blockquote-footer">
                            {{ item }}
                        </figcaption>
                    </div>
                </div>
                <div class="tab-pane fade" id="nav-telemetry" role="tabpanel" aria-labelledby="nav-te;emetry-tab"
                    tabindex="0">
                    <DeviceLatestTelemetry :selectedDevice="selectedDevice" :deviceId="selectedDevice.id"
                        :deviceName="selectedDevice.name" :socket="socket" />
                </div>
            </div>
        </div>
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

tbody tr td {
    background: #ffffff;
    outline: dashed 1px rgb(219, 219, 219);
}

tbody td {
    color: #1a202c;
    text-align: left;
    vertical-align: middle;
    font-weight: normal;
    padding: 0.25rem 0.5rem;
}

table tr:last-child td:first-child {
    border-bottom-left-radius: 0.5rem;
}

table th:first-child {
    border-top-left-radius: 0.5rem;
}

table tr:last-child td:last-child {
    border-bottom-right-radius: 0.5rem;
}

table th:last-child {
    border-top-right-radius: 0.5rem;
}

th:first-child,
td:first-child {
    position: sticky;
    left: 0;
    /*Overlapping elements with a larger z-index cover those with a smaller one.*/
    z-index: 1;
}

tbody tr:hover td {
    background-color: #eef7bd;
    color: #d83ad8;
}

.nav-tabs>.active,
.nav-tabs>.active:hover,
.nav-tabs>.active:focus {
    border-color: #d45500;
    border-bottom-color: transparent;
    background: #d45500;
    color: white;
    font-weight: 800;
}

.nav-tabs>button {
    color: #5a5a5a;
}

.nav-tabs {
    border-bottom: 1px dashed #d45500;
}

.blockquote {
    font-size: 1rem;
}

.blockquote-footer {
    color: #2559b3;
    font-weight: 800;
}
</style>