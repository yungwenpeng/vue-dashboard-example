<script setup lang="ts">
import store from "../stores/store";
import jwt_decode from 'jwt-decode';
import router from "../router";
import * as bootstrap from "bootstrap"

const isAuthenticated = () => {
    //console.log('isAuthenticated - token:', store.getters.getAuthUserToken['token']);
    if (store.getters.getAuthUserToken['token'] === null) return false;
    return true;
};

const parseAuthUserName = () => {
    //console.log('parseAuthUserName - token:', store.getters.getAuthUserToken['token']);
    if (store.getters.getAuthUserToken['token'] === null) {
        return '';
    } else {
        const userName: any = jwt_decode(store.getters.getAuthUserToken['token']);
        return userName['sub'].slice(0, userName['sub'].lastIndexOf("@"));
    }
};

const userLogout = () => {
    store.commit('removeToken');
};

const hideNavbar = () => {
    const myOffcanvas = document.getElementById('offcanvasNavbar');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas!);
    bsOffcanvas?.hide();
};

const entryComponent = (componentName: String) => {
    //console.log(`entryComponent - ${componentName}`);
    if (componentName === 'logout') {
        userLogout();
        router.push({ name: 'login' });
    } else {
        router.push({ name: `${componentName}` });
    }
    hideNavbar();
};

</script>

<template>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header row">
            <img src="@/assets/pg-logo.png" class="img-fluid" style="max-width: 170px; margin:0 auto" alt="pg-logo"
                data-bs-dismiss="offcanvas">
            <hr style="margin: 5px auto">
        </div>
        <div class="offcanvas-body">
            <div class="h3" style="margin-top: -20px;">
                <span v-if="isAuthenticated()">Hi {{ parseAuthUserName() }}</span>
                <span v-else>Hi Guest</span>
            </div>
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li v-if="isAuthenticated()" class="nav-item" @click="entryComponent('home')">
                    <i class="bi bi-house-door" style="font-size: 20px;"></i> Home
                </li>
                <li v-if="isAuthenticated()" class="nav-item" @click="entryComponent('devices')">
                    <i class="bi bi-motherboard" style="font-size: 20px;"></i> Devices
                </li>
                <li v-if="isAuthenticated()" class="nav-item" @click="entryComponent('dashboard')">
                    <i class="bi bi-columns" style="font-size: 20px;"></i> Dashboard
                </li>
                <li v-if="!isAuthenticated()" class="nav-item" @click="entryComponent('login')">
                    <!--<a href="/login" class="nav-link link-dark">-->
                    <i class="bi bi-box-arrow-right" style="font-size: 20px;"></i> Login
                    <!--</a>-->
                </li>
                <li v-if="isAuthenticated()" class="nav-item" @click="entryComponent('logout')">
                    <i class="bi bi-box-arrow-left" style="font-size: 20px;"></i> Logout
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
#offcanvasNavbar {
    background-image: url('../assets/siderbar_bg.png');
    height: 100%;
    min-width: 20%;
    max-width: 40%;
    background-repeat: no-repeat space;
    background-position: center;
    background-size: cover;
}

.nav-item {
    font-size: 20px;
    font-weight: 400;
}

.nav-item:hover {
    background-color: #ebe264;
    border-radius: 30%;
}
</style>