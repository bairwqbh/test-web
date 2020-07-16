<template>
    <avue-crud :option="option" :data="data" :page="page"
        @on-load="loadData" @refresh-change="loadData" @search-change="loadData">
        <template v-slot:search>
            <el-col :md="4">
                <el-input placeholder="请输入关键字" v-model="param.keyword" clearable/>
            </el-col>
            <el-col :md="6">
                <el-date-picker type="datetimerange" v-model="rangeDate" value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始时间" range-separator="至" end-placeholder="结束时间"/>
            </el-col>
            <el-col :md="4">
                <el-select v-model="param.channelId" @change="loadData" placeholder="请选择传输通道" clearable>
                    <el-option v-for="item in dictList.channel"
                        :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </el-col>
            <el-col :md="4">
                <el-select v-model="param.transportType" @change="loadData" placeholder="请选择传输类型" clearable>
                    <el-option v-for="item in dictList.transport_type"
                        :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
            </el-col>
        </template>
        <template v-slot:menuLeft>
            <el-button type="primary" size="small" @click="expData" icon="el-icon-download"
                v-if="$store.getters.isAuth('ter:rawdata:exp')">导出数据</el-button>
        </template>
        <template v-slot:expand="{row}">
            <el-form label-position="left" inline class="table-expand">
                <el-form-item label="消息编号">
                    <span>{{ row.messageId }}</span>
                </el-form-item>
                <el-form-item label="终端编号">
                    <span>{{ row.terminalId }}</span>
                </el-form-item>
                <el-form-item label="模组编号">
                    <span>{{ row.imei }}</span>
                </el-form-item>
                <el-form-item label="传输通道">
                    <span>{{ row.channelId }}</span>
                </el-form-item>
                <el-form-item label="传输类型">
                    <span>{{ row.transportType }}</span>
                </el-form-item>
                <el-form-item label="报文数据">
                    <span>{{ row.payload }}</span>
                </el-form-item>
                <el-form-item label="数据长度">
                    <span>{{ row.dataLength }}</span>
                </el-form-item>
                <el-form-item label="时间戳">
                    <span>{{ row.timestamp }}</span>
                </el-form-item>
                <el-form-item label="消息参数">
                    <span>{{ row.header }}</span>
                </el-form-item>
            </el-form>
        </template>
    </avue-crud>
</template>

<script>
import { mapGetters } from 'vuex';
import RawdataApi from '@/api/terminal/RawdataApi';

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
                keyword: null,
                startTime: null,
                endTime: null,
                channelId: null,
                transportType: null,
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
                column: [{
                    label: '消息编号',
                    prop: 'messageId',
                    width: 300,
                }, {
                    label: '终端编号',
                    prop: 'terminalId'
                }, {
                    label: '模组编号',
                    prop: 'imei'
                }, {
                    label: '传输通道',
                    prop: 'channelId',
                    dicData: this.dictList['channel']
                }, {
                    label: '传输类型',
                    prop: 'transportType',
                    dicData: this.dictList['transport_type']
                }, {
                    label: '数据长度',
                    prop: 'dataLength'
                }, {
                    label: '时间戳',
                    prop: 'timestamp'
                }]
            };
        },
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
            RawdataApi.page(Object.assign({
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
        },
        expData() {
            RawdataApi.expData(this.param);
        },
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
