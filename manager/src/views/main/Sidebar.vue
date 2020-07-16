<template>
    <div class="sidebar" :class="{'content-collapse': collapse}" onselectstart="return false">
        <el-menu :default-active="$route.path" class="sidebar-menu" theme="dark" :collapse="collapse"
            background-color="#324157" text-color="#FFFFFF" active-text-color="#20A0FF" unique-opened router>
            <template v-for="item in getMenu">
                <template v-if="item.children">
                    <el-submenu :index="item.funcId" :key="item.funcId">
                        <template v-slot:title>
                            <i v-if="item.icon" :class="item.icon"/>
                            <span slot="title">{{ item.funcName }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children" :index="subItem.funcId" :key="subItem.funcId">
                                <template v-slot:title>
                                    <i v-if="subItem.icon" :class="subItem.icon"/>
                                    <span slot="title">{{ subItem.funcName }}</span>
                                </template>
                                <el-menu-item v-for="(threeItem,i) in subItem.children" :index="threeItem.path" :key="threeItem.funcId">
                                    <template v-slot:title>
                                        <i v-if="threeItem.icon" :class="threeItem.icon"/>
                                        <span slot="title">{{ threeItem.funcName }}</span>
                                    </template>
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.path" :key="subItem.funcId">
                                <template v-slot:title>
                                    <i v-if="subItem.icon" :class="subItem.icon"/>
                                    <span slot="title">{{ subItem.funcName }}</span>
                                </template>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.funcId">
                        <i v-if="item.icon" :class="item.icon"/>
                        <span slot="title">{{ item.funcName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import bus from '@/service/bus';

export default {
    data() {
        return {
            collapse: false
        };
    },
    computed: {
        ...mapGetters(['getMenu'])
    },
    created() {
        bus.$on('collapse', event => this.collapse = event);
    }
}
</script>

<style scoped>
.el-menu {
    border-right: 0px;
}

.sidebar > ul {
    height: 100%;
}

.sidebar-menu:not(.el-menu--collapse) {
     width: 220px;
}
</style>
