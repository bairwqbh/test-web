<template>
    <el-container>
        <avue-crud :option="option" :data="data" :page="page"
            :permission="permission" @on-load="loadData"
            @refresh-change="loadData" @search-change="loadData"
            @row-save="add" @row-del="del" @row-update="mod">
            <template v-slot:search>
                <el-col :md="4">
                    <el-input placeholder="请输入关键字" v-model="param.keyword" clearable/>
                </el-col>
                <el-col :md="4">
                    <el-select v-model="param.typeId" @change="loadData" placeholder="请选择终端类型" clearable>
                        <el-option v-for="item in dictList.terminal_type"
                            :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-col>
            </template>
            <template v-slot:menuLeft>
                <el-button type="primary" size="small"
                    icon="el-icon-download" @click="expTpl">导出模板</el-button>
                <el-upload class="upload" name="file" accept=".xls,.xlsx" :action="action"
                    :headers="headers" :multiple="no" :show-file-list="no" :with-credentials="yes"
                    :on-success="success" :before-upload="beforeUpload" :on-error="error">
                    <el-button type="primary" size="small" icon="el-icon-upload2"
                        v-if="$store.getters.isAuth('ter:info:imp')">导入数据</el-button>
                </el-upload>
                <el-button v-if="$store.getters.isAuth('ter:commodu:exp')"
                    type="primary" size="small" icon="el-icon-download"
                    @click="expData">导出数据</el-button>
            </template>
            <template v-slot:menu="{type, size, row}">
                <el-button v-if="$store.getters.isAuth('ter:info:get')"
                    :type="type" :size="size" icon="el-icon-tickets"
                    @click="state(row)">状态</el-button>
                <el-button v-if="$store.getters.isAuth('ter:info:mod')"
                    :type="type" :size="size" icon="el-icon-setting"
                    @click="config(row)">配置</el-button>
                <el-button v-if="$store.getters.isAuth('ter:info:bind')"
                    :type="type" :size="size" icon="el-icon-connection"
                    @click="bind(row)">绑定</el-button>
                <el-button v-if="$store.getters.isAuth('ter:info:issued') && row.state && row.state.gateway && row.state.gateway.length"
                    :type="type" :size="size" icon="el-icon-bottom"
                    @click="messageIssued(row)">下发报文</el-button>
                <el-button :type="type" :size="size" icon="el-icon-tickets"
                    @click="log(row)">升级日志</el-button>
            </template>
        </avue-crud>
        <state :visible="stateShow" :data="row.state" @close="stateShow = false"/>
        <config :visible="configShow" :data="row" @close="configClose"/>
        <bind :visible="bindIsShow" :data="row" @close="close"/>
        <issued-message :visible="messageIssuedShow" :data="row" @close="messageIssuedShow = false"/>
        <fota-log :visible="logShow" :data="row" @close="logShow = false"/>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { Common } from "cby.assist";
import TerminalApi from '@/api/terminal/TerminalApi';
import State from './State';
import Config from './Config';
import Bind from './Bind';
import IssuedMessage from './IssuedMessage';
import FotaLog from './FotaLog';

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
                typeId: null,
            },
            row: {},
            bindIsShow: false,
            loading: null,
            stateShow: false,
            configShow: false,
            messageIssuedShow: false,
            logShow: false,
        };
    },
    computed: {
        ...mapGetters(['dictList']),
        option() {
            return {
                border: true,
                viewBtn: true,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                labelWidth: 120,
                menuWidth: 500,
                column: [{
                    label: '终端编号',
                    prop: 'terminalId',
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '终端名称',
                    prop: 'terminalName',
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '终端类型',
                    prop: 'typeId',
                    type: 'select',
                    dicData: this.dictList['terminal_type']
                }, {
                    label: '使用开始时间',
                    prop: 'useStartTime',
                    type: 'datetime',
                    format: 'yyyy-MM-dd HH:mm:ss',
                    valueFormat: 'yyyy-MM-dd HH:mm:ss',
                    hide: true
                }, {
                    label: '使用结束时间',
                    prop: 'useEndTime',
                    type: 'datetime',
                    format: 'yyyy-MM-dd HH:mm:ss',
                    valueFormat: 'yyyy-MM-dd HH:mm:ss',
                    hide: true
                }, {
                    label: '程序版本号',
                    prop: 'versionNo',
                    addDisplay: false,
                    readonly: true,
                    hide: true
                }, {
                    label: '版本序列',
                    prop: 'versionSerial',
                    type: 'number',
                    addDisplay: false,
                    readonly: true,
                    hide: true
                }, {
                    label: '使用次数',
                    prop: 'useNum',
                    type: 'number',
                    addDisplay: false,
                    readonly: true,
                    hide: true
                }, {
                    label: '状态',
                    prop: 'status',
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('ter:info');
        },
        action() {
            return `${this.$config.baseUrl}${this.$config.basePath}/terminal/impData`;
        },
        headers() {
            return {token: Common.getCookie("token")};
        },
    },
    methods: {
        loadData(page) {
            TerminalApi.page(Object.assign({
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
        add(row, done, loading) {
            TerminalApi.add(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('新增成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            TerminalApi.mod(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('修改成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        del(row, index) {
            this.$confirm('确认删除该记录吗?', {
                type: 'warning'
            }).then(() => {
                TerminalApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData(this.page);
                    }
                });
            }).catch(() => {});
        },
        bind(row) {
            this.row = row;
            this.bindIsShow = true;
        },
        close() {
            this.bindIsShow = false;
        },
        expTpl() {
            TerminalApi.expTpl();
        },
        expData() {
            TerminalApi.expData(this.param);
        },
        beforeUpload() {
            this.loading = this.$loading();
        },
        success(response, file, fileList) {
            this.loading && this.loading.close();
            if (response.code == 0) {
                this.loadData(this.page)
                this.$message.success('提交成功！');
            } else {
                this.$message.error(response.message);
            }
        },
        error(err, file) {
            this.loading && this.loading.close();
            this.$message.error('提交失败！');
        },
        state(row) {
            this.row = row;
            this.stateShow = true;
        },
        config(row) {
            this.row = row;
            this.configShow = true;
        },
        configClose(config) {
            this.configShow = false;
            if (config) {
                this.row.config = config;
            }
        },
        messageIssued(row) {
            this.row = row;
            this.messageIssuedShow = true;
        },
        log(row) {
            this.row = row;
            this.logShow = true;
        },
    },
    components: { State, Config, Bind, IssuedMessage, FotaLog }
}
</script>

<style scoped>
.upload {
    display: inline;
}
</style>
