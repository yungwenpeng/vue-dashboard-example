<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import store from "./stores/store";
import jwt_decode from 'jwt-decode';
import { useRoute } from 'vue-router';

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
}

const userLogout = () => {
  store.commit('removeToken');
}

const route = useRoute()

const getPath = () => {
  const path = route.path.slice(1);
  //console.log('CurrentPath - ', path);
  if (path === '') return 'Home';
  if (path.length > 22 ) {
    return path[0].toLocaleUpperCase() + path.slice(1).substring(0,21) + '...';
  }
  return path[0].toLocaleUpperCase() + path.slice(1);
};
</script>

<template>
  <!-- <div class="App" :style="{ backgroundImage: 'url(' + 'src/assets/welcome_bg.png' + ')' }"> -->
  <div id="App">
    <header class="navbar navbar-dark bg-primary">
      <div id="logo">
        <a data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <img src="@/assets/pg-logo.png" />
        </a>
        <div class="overlay">Nagivation menu</div>
      </div>
      <div class="justify-content-start col">
        <span id="title" class="navbar-text text-white text-truncate">
          {{ getPath() }}
        </span>
      </div>
      <div class="container-fluid col justify-content-end" v-if="isAuthenticated()">
        <span class="navbar-brand mb-0">Welcome {{ parseAuthUserName() }}</span>
        <a href="/login" class="nav-link text-white" @click="userLogout">
          <i class="bi bi-box-arrow-left"></i><span>Logout</span>
        </a>
      </div>
    </header>

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

    <RouterView />
  </div>
</template>

<style scoped>
#App {
  background-image: url('assets/welcome_bg.png');
  background-repeat: no-repeat space;
  background-size: cover;
  background-position: center center;
  min-width: 100vw;
  min-height: 100vh;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#logo {
  position: relative;
  margin: 0 10px 0 10px;
}

.overlay {
  position: absolute;
  margin: 50px -50px;
  width: 80%;
  transition: .5s ease;
  opacity: 0;
  color: rgb(240, 234, 234);
  font-size: 12px;
  text-align: right;
  font-weight: bold;
  display: inline-flex;
  background-color: #6d6d70;
}

#logo:hover .overlay {
  opacity: 1;
}

#title {
  font-size: 20px;
  text-align: start;
  padding: auto;
  color: white;
}

#offcanvasNavbar {
  background-image: url('assets/siderbar_bg.png');
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
