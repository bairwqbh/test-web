<template>
    <avue-crud :option="option" :data="data" :page="page"
        @on-load="loadData" @refresh-change="loadData" @search-change="loadData">
        <template v-slot:search>
            <el-col :md="4">
                <el-input placeholder="请输入关键字" v-model="param.keyword" clearable/>
            </el-col>
            <el-col :md="4">
                <el-select v-model="param.sysId" @change="loadData"
                    clearable placeholder="请选择系统">
                    <el-option v-for="item in dictList.system_flag"
                        :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </el-col>
            <el-col :md="4">
                <el-date-picker type="daterange" v-model="rangeDate" value-format="yyyy-MM-dd"
                    start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期"/>
            </el-col>
        </template>
        <template v-slot:expand="{row}">
            <el-form label-position="left" inline class="table-expand">
                <el-form-item label="日志类型">
                    <span>{{ $store.getters.getDictName('log_type', row.logType) }}</span>
                </el-form-item>
                <el-form-item label="系统名称">
                    <span>{{ $store.getters.getDictName('system_flag', row.sysId) }}</span>
                </el-form-item>
                <el-form-item label="操作信息">
                    <span>{{ row.info }}</span>
                </el-form-item>
                <el-form-item label="请求地址">
                    <span>{{ row.path }}</span>
                </el-form-item>
                <el-form-item label="参数">
                    <span>{{ row.param }}</span>
                </el-form-item>
                <el-form-item label="IP地址">
                    <span>{{ row.ip }}</span>
                </el-form-item>
                <el-form-item label="操作用户">
                    <span>{{ row.userId }}</span>
                </el-form-item>
                <el-form-item label="异常信息">
                    <span>{{ row.exception }}</span>
                </el-form-item>
                <el-form-item label="记录时间">
                    <span>{{ row.recordTime }}</span>
                </el-form-item>
            </el-form>
        </template>
    </avue-crud>
</template>

<script>
import { mapGetters } from 'vuex';
import LogApi from '@/api/sys/LogApi';

export default {
    data() {
        return {
            data: [],
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            param: {
                sysId: null,
                keyword: null
            },
            rangeDate: null
        };
    },
    computed: {
        ...mapGetters(['dictList']),
        option() {
            return {
                maxHeight: 700,
                addBtn: false,
                menu: false,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                expand: true,
                header: false,
                column: [{
                    label: '日志类型',
                    prop: 'logType',
                    dicData: this.dictList['log_type'],
                    width: 100
                }, {
                    label: '系统名称',
                    prop: 'sysId',
                    dicData: this.dictList['system_flag'],
                    width: 200
                }, {
                    label: '操作用户',
                    prop: 'userId',
                    width: 100
                }, {
                    label: '操作信息',
                    prop: 'info'
                }, {
                    label: '请求地址',
                    prop: 'path',
                    width: 300
                }, {
                    label: 'IP地址',
                    prop: 'ip',
                    width: 200
                }, {
                    label: '记录时间',
                    prop: 'recordTime',
                    width: 150
                }]
            };
        }
    },
    methods: {
        loadData(page) {
            if (this.rangeDate) {
                this.param.startTime = this.rangeDate[0];
                this.param.endTime = this.rangeDate[1];
            } else {
                this.param.startTime = null;
                this.param.endTime = null;
            }
            LogApi.page(Object.assign({
                page: page.currentPage,
                size: page.pageSize
            }, this.param)).then(result => {
                if (result.list) {
                    this.data = result.list;
                } else {
                    this.data = [];
                }
                this.page.total = result.total;
            });
        }
    }
}
</script>

<style scoped>
.table-expand {
    margin-left: 70px;
    font-size: 0;
}

.table-expand >>> label {
    width: 100px;
    color: #99a9bf;
}

.table-expand >>> .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
}
</style>
