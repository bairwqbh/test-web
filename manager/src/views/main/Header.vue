<template>
    <div class="header">
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <router-link class="title" to="/">{{ $config.sysName }}</router-link>
        <div class="right">
            <el-menu mode="horizontal" @select="handleSelect"
                background-color="#242F42" text-color="#FFFFFF"
                :active-text-color="activeTextColor">
                <el-submenu index="user" style="border-bottom-color: blue!important;">
                    <template v-slot:title>{{ getUserId }}</template>
                    <el-menu-item index="userInfo" @click="userInfo">用户信息</el-menu-item>
                    <el-menu-item index="modPwd" @click="modPwd">修改密码</el-menu-item>
                </el-submenu>
                <el-menu-item index="logout">
                    <img src="../../assets/img/exit.png" title="退出">
                </el-menu-item>
            </el-menu>
        </div>
        <UserInfo :isShow="userInfoShow" @close="close"/>
        <ModPwd :isShow="pwdShow" @sure="sure" @close="close"/>
    </div>
</template>

<script>
import bus from '@/service/bus';
import { Common } from 'cby.assist';
import UserInfo from './UserInfo';
import ModPwd from './ModPwd';
import SystemApi from '@/api/SystemApi';
import { mapGetters, mapMutations } from 'vuex';

export default {
    data() {
        return {
            collapse: false,
            userInfoShow: false,
            pwdShow: false,
            activeTextColor: "#FFD04B",
        }
    },
    computed: {
        ...mapGetters(['getUserId'])
    },
    methods: {
        ...mapMutations(['clearInfo', 'clearMenu']),
        logout() {
            this.$confirm("确定退出当前用户吗?", "退出登录", {
                type: 'warning'
            }).then(() => {
                SystemApi.logout().then(result => {
                    this.clearInfo();
                    this.clearMenu();
                    this.$router.push("/login");
                    Common.delCookie("token");
                });
            }).catch({});
        },
        handleSelect(key, keyPath) {
            if (key) {
                switch (key) {
                case "logout":
                    this.logout();
                    break;
                }
            }
        },
        //登录用户信息
        userInfo() {
            this.userInfoShow = true;
        },
        //修改密码
        modPwd() {
            this.pwdShow = true;
        },
        sure() {
            this.userInfoShow = false;
            this.pwdShow = false;
        },
        close() {
            this.userInfoShow = false;
            this.pwdShow = false;
        },
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
    },
    components: { ModPwd, UserInfo }
}
</script>

<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    font-size: 24px;
    color: #FFFFFF;
}

.collapse-btn {
    float: left;
    padding: 0 20px;
    cursor: pointer;
    line-height: 60px;
}

.collapse-btn:hover {
    background: #283446;
}

.title {
    float: left;
    line-height: 60px;
    font-weight: bold;
    color: #87CECB;
}

.right {
    float: right;
    font-size: 16px;
}
</style>
