<template>
    <div class="wrapper">
        <el-card class="box-card">
            <div class="login-title">{{ $config.sysName }}</div>
            <el-form ref="form" :model="data" :rules="rules" label-width="0px">
                <el-form-item prop="username">
                    <el-input v-model="data.username" placeholder="请输入用户名" maxlength="32"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="data.password" placeholder="请输入密码" type="password"
                        @keyup.enter.native="login" maxlength="32"/>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login">登录</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { Common } from 'cby.assist';
import SystemApi from '@/api/SystemApi';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            data: {
                username: "",
                password: ""
            },
            rules: {
                username: [{
                    required: true,
                    message: "请输入用户名",
                    trigger: "blur"
                }], password: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }]
            }
        }
    },
    created() {
        document.onkeydown = event => {
            var theEvent = window.event || event;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                this.login();
            }
        }
    },
    methods: {
        ...mapActions(['loadDict', 'loadInfo']),
        login() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    SystemApi.login(this.data).then(result => {
                        if (result) {
                            Common.delCookie("token");
                            Common.setCookie("token", result, this.$config.expiredays);
                            this.loadDict();
                            this.loadInfo();
                            this.$router.push("/index");
                        }
                    });
                } else {
                    return false;
                }
            });
        }
    }
}
</script>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../assets/img/bg.png");
    background-repeat: no-repeat;
    background-size: cover;
}

.box-card {
    text-align: center;
    width: 400px;
}

.login-title {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
    color: gray;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 40px;
}
</style>
