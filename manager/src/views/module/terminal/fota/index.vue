<template>
    <el-container>
        <avue-crud ref="crud" :option="option" :data="data" :page="page" v-model="form"
            :permission="permission" @on-load="loadData" :before-open="open"
            @refresh-change="loadData" @search-change="loadData" @cell-mouse-enter="select" 
            @row-save="add" @row-del="del" :cell-style="cellStyle">
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
            <template v-slot:upgradeId="{type, size, row}">
                <el-button type="text" @click="log(row)">{{ row.upgradeId }}</el-button>
            </template>
            <template v-slot:menu="{type, size, row}">
                <el-button icon="el-icon-connection" :type="type"
                    v-if="(row.status == 'ready' || row.status == 'interrupt') && $store.getters.isAuth('ter:fota:bind')"
                    :size="size" @click="bind(row)">绑定</el-button>
                <el-button icon="el-icon-video-play" :type="type"
                    v-if="(row.status == 'ready' || row.status == 'interrupt') && $store.getters.isAuth('ter:fota:exe')"
                    :size="size" @click="execute(row)">执行升级</el-button>
                <el-button icon="el-icon-video-pause" :type="type"
                    v-if="row.status == 'process' && $store.getters.isAuth('ter:fota:int')"
                    :size="size" @click="interrupt(row)">中断</el-button>
                <el-button icon="el-icon-circle-close" :type="type"
                    v-if="row.status == 'process' && $store.getters.isAuth('ter:fota:over')"
                    :size="size" @click="close(row)">强制结束</el-button>
                <el-button icon="el-icon-circle-close" :type="type"
                    v-if="row.isCache && $store.getters.isAuth('ter:fota:exe')"
                    :size="size" @click="clearCache(row)">清除缓存</el-button>
                <el-button icon="el-icon-download" :type="type"
                    :size="size" @click="download(row)">下载</el-button>
                <el-button icon="el-icon-delete" :type="type"
                    v-if="row.status != 'process' && $store.getters.isAuth('ter:fota:del')"
                    :size="size" @click="del(row)">删除</el-button>
            </template>
            <template v-slot:uploadForm="{size}">
                <el-upload ref="upload" name="file" :action="action" :headers="headers" :limit="1"
                    :data="form" :show-file-list="yes" :multiple="no" :auto-upload="no"
                    :with-credentials="yes" :on-change="change" :on-success="success" :on-error="error">
                    <el-button :size="size" type="primary" icon="el-icon-upload">选择文件</el-button>
                </el-upload>
            </template>
            <template v-slot:bindForm>
                <el-transfer filterable v-model="bindValue"
                    :data="bindList" :titles="bindTitles" :props="bindProps"/>
            </template>
            <template v-slot:menuForm="{size}">
                <el-button type="danger" :size="size" @click="saveAndExecute"
                    v-if="formType == 'add' && $store.getters.isAuth('ter:fota:exe')">保存并执行</el-button>
            </template>
        </avue-crud>
        <bind :isShow="bindIsShow" :data="row" @close="bindClose"/>
        <log :visible="logShow" :data="row" @close="logShow = false"/>
    </el-container>
</template>

<script>
import { Common } from "cby.assist";
import { mapGetters } from 'vuex';
import FotaApi from '@/api/terminal/FotaApi';
import TerminalApi from '@/api/terminal/TerminalApi';
import TerminalFotaApi from '@/api/terminal/TerminalFotaApi';
import AttachApi from '@/api/sys/AttachApi';
import Bind from './Bind';
import Log from './Log';

export default {
    data() {
        return {
            data: [],
            form: {},
            done: null,
            row: {},
            bindIsShow: false,
            loading: null,
            uploadFile: null,
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            param: {
                keyword: null,
                typeId: null,
            },
            downloadParam: {
                domainId: 'ter_fota',
                targetId: null
            },
            bindList: [],
            bindValue: [],
            bindTitles: ["未绑定", "已绑定"],
            bindProps: {key: "terminalId", label: "terminalId"},
            formType: null,
            logShow: false,
        };
    },
    computed: {
        ...mapGetters(['dictList', 'getUser']),
        option() {
            return {
                border: true,
                viewBtn: true,
                editBtn: false,
                delBtn: false,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                dialogWidth: 800,
                dialogHeight: 535,
                labelWidth: 120,
                menuWidth: 330,
                column: [{
                    label: '升级编号',
                    prop: 'upgradeId',
                    addDisplay: false,
                    readonly: true,
                    slot: true,
                    width: 210,
                }, {
                    label: '终端类型',
                    prop: 'typeId',
                    type: 'select',
                    dicData: this.dictList['terminal_type'],
                    change: ({value}) => {
                        this.bindList = [];
                        this.bindValue = [];
                        TerminalApi.fotaBindInfo({typeId: value}).then(result => {
                            if (result && result.list && result.list.length) {
                                this.bindList = result.list;
                            }
                        });
                    },
                }, {
                    label: '程序版本号',
                    prop: 'versionNo',
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }],
                }, {
                    label: '版本序列',
                    prop: 'versionSerial',
                    addDisplay: false,
                    readonly: true,
                }, {
                    label: '上传文件',
                    prop: 'upload',
                    formslot: true,
                    viewDisplay: false,
                    hide: true,
                }, {
                    label: '关联模式',
                    prop: 'assoMode',
                    type: 'select',
                    dicData: this.dictList['asso_mode'],
                }, {
                    label: '发布人',
                    prop: 'publisher',
                    addDisplay: false,
                    readonly: true,
                }, {
                    label: '发布时间',
                    prop: 'publishTime',
                    addDisplay: false,
                    readonly: true,
                }, {
                    label: '状态',
                    prop: 'status',
                    type: 'select',
                    dicData: this.dictList['fota_status'],
                    addDisplay: false,
                    readonly: true,
                }, {
                    label: '内容描述',
                    prop: 'content',
                    type: 'textarea',
                    minRows: 2,
                    hide: true,
                    rules: [{
                        max: 4000,
                        message: '最多4000个字符',
                        trigger: 'blur'
                    }],
                    row: true,
                    span: 24,
                }, {
                    label: '绑定终端',
                    prop: 'bind',
                    formslot: true,
                    hide: true,
                    row: true,
                    span: 24,
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('ter:fota');
        },
        action() {
            return `${this.$config.baseUrl}${this.$config.basePath}/fota/save`;
        },
        headers() {
            return {token: Common.getCookie("token")};
        },
    },
    methods: {
        getUploadUrl(saveMode) {
            return `${this.$config.baseUrl}${this.$config.basePath}/fota/${saveMode}`;
        },
        select(row) {
            this.row = row;
        },
        open(done, type) {
            done();
            this.formType = type;
            this.bindValue = [];
            if (type == 'add') {
                return;
            }
            TerminalApi.fotaBindInfo({
                typeId: this.row.typeId,
                upgradeId: this.row.upgradeId
            }).then(result => {
                if (result) {
                    this.bindValue = result.value && result.value.length ? result.value : [];
                }
            });
        },
        loadData(page) {
            FotaApi.page(Object.assign({
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
            if (!this.uploadFile || !this.uploadFile.name) {
                this.$message.error('没有上传升级文件，无法提交！');
                loading();
                return;
            }
            this.form.execute = false;
            this.done = done;
            this.loading = loading;
            this.form.publisher = this.getUser.userId;
            this.form.terminalIds = this.bindValue;
            this.$refs.upload.submit();
        },
        del(row, index) {
            this.$confirm('确认删除该记录吗?', {
                type: 'warning'
            }).then(() => {
                FotaApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData(this.page);
                    }
                });
            }).catch(() => {});
        },
        change(file, fileList) {
            if (file.status === "ready") {
                this.uploadFile = file;
            } else {
                file.status = "ready";
                delete file.response;
            }
        },
        success(response, file, fileList) {
            this.loading && this.loading();
            if (response.code == 0) {
                this.uploadFile = null;
                if (this.done) {
                    this.done();
                } else {
                    this.$refs.crud.closeDialog();
                }
                this.$message.success('提交成功！');
                this.loadData(this.page);
            } else {
                this.$message.error(response.message);
            }
        },
        error(err, file) {
            this.loading && this.loading();
            this.$message.error('提交失败！');
        },
        bind(row) {
            this.row = row;
            this.bindIsShow = true;
        },
        bindClose() {
            this.bindIsShow = false;
        },
        log(row) {
            this.row = row;
            this.logShow = true;
        },
        saveAndExecute() {
            const self = this;
            self.$refs.crud.validate(valid => {
                if (valid) {
                    if (!self.uploadFile || !self.uploadFile.name) {
                        self.$message.error('没有上传升级文件，无法提交！');
                        return;
                    }
                    if (!self.bindValue || !self.bindValue.length) {
                        self.$message.error('未绑定终端，无法执行升级！');
                        return;
                    }
                    self.$confirm('确认要保存并立即执行FOTA升级吗?', {
                        type: 'warning'
                    }).then(() => {
                        FotaApi.check(self.form).then(result => {
                            if (result) {
                                save();
                            } else {
                                self.$confirm('该类型的终端正在升级中确定要将其覆盖吗?', {
                                    type: 'warning'
                                }).then(save).catch(() => {});
                            }
                            function save() {
                                self.done = null;
                                self.form.execute = true;
                                self.form.publisher = self.getUser.userId;
                                self.form.terminalIds = self.bindValue;
                                self.$refs.upload.submit();
                            }
                        });
                    }).catch(() => {});
                }
            });
        },
        execute(row) {
            this.$confirm('确认要执行FOTA升级吗?', {
                type: 'warning'
            }).then(() => {
                FotaApi.check(row).then(result => {
                    if (result) {
                        FotaApi.execute(row).then(result => {
                            if (result) {
                                this.$message.success('操作成功！');
                                this.loadData(this.page);
                            }
                        });
                    } else {
                        this.$confirm('该类型的终端正在升级中确定要将其覆盖吗?', {
                            type: 'warning'
                        }).then(() => {
                            FotaApi.execute(row).then(result => {
                                if (result) {
                                    this.$message.success('操作成功！');
                                    this.loadData(this.page);
                                }
                            });
                        }).catch(() => {});
                    }
                });
            }).catch(() => {});
        },
        interrupt(row) {
            this.$confirm('确认要中断FOTA升级吗?', {
                type: 'warning'
            }).then(() => {
                FotaApi.interrupt(row).then(result => {
                    if (result) {
                        this.$message.success('操作成功！');
                        this.loadData(this.page);
                    }
                });
            }).catch(() => {});
        },
        close(row) {
            this.$confirm('确认要强制关闭FOTA升级吗?', {
                type: 'warning'
            }).then(() => {
                FotaApi.close(row).then(result => {
                    if (result) {
                        this.$message.success('操作成功！');
                        this.loadData(this.page);
                    }
                });
            }).catch(() => {});
        },
        clearCache(row) {
            FotaApi.clearCache(row.upgradeId).then(result => {
                if (result) {
                    this.$message.success('操作成功！');
                    row.isCache = false;
                }
            });
        },
        download(row) {
            this.downloadParam.targetId = row.upgradeId;
            AttachApi.find(this.downloadParam).then(result => {
                if (!result) {
                    this.$message.warning('未获取到附件信息，无法下载！');
                    return;
                }
                this.$download(result);
            });
        },
        cellStyle({row, column, rowIndex, columnIndex}) {
            if (column.property == 'status') {
                switch (row.status) {
                    case 'ready':
                        return {color:'blue'};
                    case 'process':
                        return {color:'green'};
                    case 'over':
                        return {color:'black'};
                    case 'interrupt':
                        return {color:'red'};
                    default:
                        break;
                }
            }
        },
    },
    components: { Bind, Log },
}
</script>

<style scoped>
.el-transfer >>> .el-transfer-panel {
    line-height: 0;
    width: 250px;
}
</style>
