<template>
    <el-container class="wrapper">
        <el-header>
            <v-header/>
        </el-header>
        <el-container>
            <v-sidebar/>
            <el-main>
                <transition name="move" mode="out-in">
                    <router-view/>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import vHeader from "./Header";
import vSidebar from "./Sidebar";

export default {
    components: {vHeader, vSidebar}
}
</script>

<style scoped>
.el-header {
    background-color: #242F42;
    color: #FFFFFF;
    line-height: 60px;
    padding: 0;
}

.sidebar {
    background-color: #324157;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 60px);
}

.el-main {
    flex-basis: 0px;
    padding: 10px;
    overflow: auto;
    height: calc(100vh - 60px);
}
</style>
