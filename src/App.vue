<script setup lang="ts">
import { RouterView } from "vue-router";
import store from "./stores/store";
import { useRoute } from 'vue-router';
import Drawer from "./components/Drawer.vue";

const isAuthenticated = () => {
  //console.log('isAuthenticated - token:', store.getters.getAuthUserToken['token']);
  if (store.getters.getAuthUserToken['token'] === null) return false;
  return true;
};

const userLogout = () => {
  store.commit('removeToken');
};

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
        <a href="/login" class="nav-link text-white" @click="userLogout">
          <i class="bi bi-box-arrow-left" style="margin-right: 10px"></i><span>Logout</span>
        </a>
      </div>
    </header>
    <Drawer />
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
</style>
