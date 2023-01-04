<script lang="ts">
import { defineComponent } from "vue";
import RestApiService from '../services/auth_service';
import store from "../stores/store";
import router from "../router";

export default defineComponent({
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
            passwordFieldType: "password",
            msg: { username: '', password: '' },
        };
    },
    methods: {
        validateUsername(value: any) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                this.msg['username'] = '';
            } else {
                this.msg['username'] = 'Username invalid! it should be email address format';
            }
        },
        validatePassword(value: any) {
            let difference = 8 - value.length;
            if (value.length < 8) {
                this.msg['password'] = 'Must be 8 characters! ' + difference + ' characters left';
            } else {
                this.msg['password'] = '';
            }
        },
        switchVisibility() {
            this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
        },
        async userLogin() {
            let requestBody = '{"username":"' + this.username
                + '", "password":"' + this.password + '"}'
            await RestApiService.login(requestBody)
                .then(res => {
                    if (res.status === 200) {
                        //console.log('userLogin() - token:', res.data);
                        store.commit('setToken', res.data);
                        router.push('/');
                    }
                    return res.data;
                });

        },
        userLogout() {
            store.commit('removeToken');
        }
    },
    watch: {
        username(value) {
            this.username = value;
            this.validateUsername(value);
        },
        password(value) {
            this.password = value;
            this.validatePassword(value);
        }
    }
});
</script>

<template>
    <div id="loginDiv" class="container-fluid mt-3 w-75 pt-3 pb-3">
        <div class="card">
            <h1 class="card-header">Login</h1>
            <div class="input-group mb-2 pt-3" for="username">
                <span class="input-group-text" id="bi-person">
                    <i class="bi bi-person-fill" style="font-size: 1.4rem"></i>
                </span>
                <input type="text" class="form-control" id="username" required v-model="username" name="username"
                    placeholder="Username" aria-label="Username">
            </div>
            <span class="alert alert-danger pt-1 pb-1" v-if="msg['username'].length > 0">
                {{ msg['username'] }}
            </span>
            <div class="input-group mb-2">
                <span class="input-group-text" id="bi-key">
                    <i class="bi bi-key-fill" style="font-size: 1.4rem"></i>
                </span>
                <input :type="passwordFieldType" class="form-control" required v-model="password" name="password"
                    placeholder="Password" aria-label="Password" aria-describedby="password">
                <span class="input-group-text" id="bi-eye" @click="switchVisibility">
                    <i :class="[passwordFieldType === 'password' ? 'bi-eye-fill' : 'bi-eye-slash-fill', 'bi']"
                        style="font-size: 1.4rem"></i>
                </span>
            </div>
            <span class="alert alert-danger pt-1 pb-1" v-if="msg['password'].length > 0">
                {{ msg['password'] }}
            </span>
            <button @click="userLogin" class="btn btn-primary text-center fs-4 fw-bold shadow rounded">
                <i class="bi bi-box-arrow-right" style="margin-right: 10px"></i>
                Login
            </button>
        </div>
    </div>
</template>

<style scoped>
#loginDiv {
    width: 500px;
    border: 1px solid #CCCCCC;
    border-radius: 10px;
    background-color: white;
}
</style>
