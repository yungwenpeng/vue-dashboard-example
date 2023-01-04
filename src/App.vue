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
  return path[0].toLocaleUpperCase() + path.slice(1);
};
</script>

<template>
  <!-- <div class="App" :style="{ backgroundImage: 'url(' + 'src/assets/welcome_bg.png' + ')' }"> -->
  <div id="App">
    <header class="navbar navbar-dark bg-primary">
      <div id="logo">
        <a>
          <img src="@/assets/pg-logo.png" />
        </a>
        <div class="overlay">Nagivation menu</div>
      </div>
      <div class="container-fluid col">
        <span id="title">{{ getPath() }}</span>
      </div>
      <div class="container-fluid col justify-content-end" v-if="isAuthenticated()">
        <span class="navbar-brand mb-0">Welcome {{ parseAuthUserName() }}</span>
        <a href="/login" class="nav-link text-white" @click="userLogout">
          <i class="bi bi-box-arrow-left"></i><span>Logout</span>
        </a>
      </div>

    </header>

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
</style>
