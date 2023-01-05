<script setup lang="ts">
import store from "../stores/store";
import jwt_decode from 'jwt-decode';

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

</script>

<template>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header row">
            <img src="@/assets/pg-logo.png" class="img-fluid" style="max-width: 170px; margin:0 auto" alt="pg-logo"
                data-bs-dismiss="offcanvas">
            <hr style="margin: 5px auto">
        </div>
        <div class="offcanvas-body">
            <div class="h5" style="margin-top: -20px;">
                <span v-if="isAuthenticated()">Hi {{ parseAuthUserName() }}</span>
                <span v-else>Hi Guest</span>
            </div>
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li v-if="isAuthenticated()" class="nav-item">
                    <a href="/" class="nav-link link-dark" aria-current="page">
                        <i class="bi bi-house-door" style="font-size: 20px;"></i> Home
                    </a>
                </li>
                <li v-if="isAuthenticated()" class="nav-item">
                    <a href="/devices" class="nav-link link-dark">
                        <i class="bi bi-motherboard" style="font-size: 20px;"></i> Devices
                    </a>
                </li>
                <li v-if="isAuthenticated()" class="nav-item">
                    <a href="/dashboard" class="nav-link link-dark">
                        <i class="bi bi-columns" style="font-size: 20px;"></i> Dashboard
                    </a>
                </li>
                <li v-if="!isAuthenticated()" class="nav-item">
                    <a href="/login" class="nav-link link-dark">
                        <i class="bi bi-box-arrow-right" style="font-size: 20px;"></i> Login
                    </a>
                </li>
                <li v-if="isAuthenticated()" class="nav-item">
                    <a href="/login" class="nav-link link-dark" @click="userLogout">
                        <i class="bi bi-box-arrow-left" style="font-size: 20px;"></i> Logout
                    </a>
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
    font-size: 16px;
    font-weight: 600;
}

.nav-item:hover {
    background-color: #ebe264;
    border-radius: 30%;
}
</style>