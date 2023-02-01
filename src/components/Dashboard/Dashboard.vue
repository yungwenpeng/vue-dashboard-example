<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, watchEffect } from 'vue';
import store from "../../stores/store";
import jwtDecode from "jwt-decode";
import RestApiService from '../../services/service';
import router from "../../router";

const floors = ref([]);

const getAssetInfos = async () => {
    const token: any = store.getters.getAuthUserToken['token'];
    const decoded: any = jwtDecode(token);
    if (decoded['scopes'][0] === 'TENANT_ADMIN') {
        RestApiService.getTenantAssetInfos(token)
            .then(res => {
                let assetDescending = [] as any;
                assetDescending = [...res.data.data].sort((a, b) =>
                    a['name'] > b['name'] ? -1 : 1,
                );
                floors.value = assetDescending;
                console.log('getAssetInfos(TENANT) - assetDescending:', assetDescending);
            });
    } else if (decoded['scopes'][0] === 'CUSTOMER_USER') {
        RestApiService.getCustomerAssetInfos(decoded['customerId'], token)
            .then(res => {
                let assetDescending = [] as any;
                assetDescending = [...res.data.data].sort((a, b) =>
                    a['name'] > b['name'] ? -1 : 1,
                );
                floors.value = assetDescending;
                console.log('getAssetInfos(USER) - assetDescending:', assetDescending);
            });
    }
};

onBeforeMount(() => {
    //console.log(`onBeforeMount`);
    getAssetInfos();
});

const selectFloor = (floor: any) => {
    console.log('selectDevice: ', floor['name'], ', id:', floor['id']['id'].slice(0, 8));
    // Refer to : https://ithelp.ithome.com.tw/articles/10269680
    router.push({ name: 'floor', params: { floorId: floor['id']['id'] } });
};

</script>

<template>
    <div style="margin-left: 5rem;" v-if="floors.length > 0">
        <div id="topo">Commercial Building</div>
        <ul id="andares" v-for="floor in floors">
            <li @click="selectFloor(floor)" style="width: 0px;">
                <div class="frente">{{ floor['name'] }}</div>
                <div class="lado"></div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
#topo {
    background-color: #185291;
    width: 200px;
    height: 30px;
    transform: skewX(-45deg);
    -webkit-transform: skewX(-45deg);
    -moz-transform: skewX(-45deg);
    -o-transform: skewX(-45deg);
    -ms-transform: skewX(-45deg);
    margin: 30px 0px 22px -6px;
    text-align: center;
    font-weight: bold;
    color: white;
}

#andares {
    list-style-type: none;
    margin: 2px;
}

#andares .frente {
    background-color: #2762a1;
    width: 197px;
    height: 30px;
    transform: translate(-54px);
    -webkit-transform: translate(-54px);
    -moz-transform: translate(-54px);
    -o-transform: translate(-54px);
    -ms-transform: translate(-54px);
    margin-top: -18px;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    padding: 2px;
    color: white;
}

#andares li:hover .frente {
    background-color: #eedb22;
    color: rgb(97, 70, 70);
}

#andares .lado {
    background-color: #2762a1;
    width: 20px;
    height: 20px;
    margin: 1px;
    margin-left: 99px;
    transform: translate(52px) rotate(90deg) scale(1.5) skewX(45deg) translate(-27px);
    -webkit-transform: translate(52px) rotate(90deg) scale(1.5) skewX(45deg) translate(-27px);
    -moz-transform: translate(52px) rotate(90deg) scale(1.5) skewX(45deg) translate(-27px);
    -o-transform: translate(52px) rotate(90deg) scale(1.5) skewX(45deg) translate(-27px);
    -ms-transform: translate(52px) rotate(90deg) scale(1.5) skewX(45deg) translate(-27px);
}

#andares li:hover .lado {
    background-color: #8f8e0d;
}
</style>