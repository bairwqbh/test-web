<template>
    <el-container>
        <el-header class="header-box">
            <div class="right">
                <el-input placeholder="请输入关键字" v-model="param.keyword" style="width: 50vh;">
                    <template v-slot:append>
                        <el-button icon="el-icon-search" @click="loadData"/>
                    </template>
                </el-input>
            </div>
        </el-header>
        <el-main class="main-box">
            <el-table height="calc(100vh - 140px)" border lazy :data="data" row-key="id"
                size="small" :tree-props="{children: 'children', hasChildren: 'hasChild'}" :load="loadChild">
                <el-table-column prop="areaId" label="地区代码"/>
                <el-table-column prop="areaName" label="地区名称"/>
                <el-table-column prop="level" label="地区等级">
                    <template v-slot="{row}">{{ levelName(row.level) }}</template>
                </el-table-column>
                <el-table-column prop="x" label="经度"/>
                <el-table-column prop="y" label="纬度"/>
                <el-table-column label="操作">
                    <template v-slot="{row}">
                        <el-button icon="el-icon-location" size="mini" type="primary"
                            @click="locate(row)">定位</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <locate :title="locateTitle" :is-show="locateShow" :data="locateData" @close="close"/>
    </el-container>
</template>

<script>
import Locate from "./Locate";
import AreaApi from '@/api/sys/AreaApi';

export default {
    data() {
        return {
            data: [],
            param: {
                keyword: null,
                parentId: 0
            },
            locateShow: false,
            locateTitle: "",
            locateData: {}
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            if (this.param.keyword) {
                this.param.parentId = null;
            } else {
                this.param.parentId = 0;
            }
            AreaApi.list(this.param).then(result => {
                if (result) {
                    this.data = result;
                }
            });
        },
        loadChild(item, itemNode, resolve) {
            AreaApi.list({parentId: item.areaId}).then(result => {
                if (result) {
                    resolve(result);
                }
            });
        },
        locate(row) {
            this.locateShow = true;
            this.locateTitle = row.areaName;
            this.locateData = row;
        },
        close() {
            this.locateShow = false;
        },
        levelName(level) {
            switch (level) {
                case 1:
                    return "省级";
                case 2:
                    return "地市级";
                case 3:
                    return "区县级";
                default:
                    return "-";
            }
        }
    },
    components: { Locate }
}
</script>

<style scoped>
.header-box {
    padding: 0px;
}

.main-box {
    padding: 0px;
}
</style>
