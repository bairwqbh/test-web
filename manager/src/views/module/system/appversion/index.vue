<template>
    <avue-crud :option="option" :data="data" :page="page" v-model="form"
        :permission="permission" @on-load="loadData" @row-save="add" @row-del="del">
        <template v-slot:menu="{type, size, row}">
            <el-button icon="el-icon-download" :type="type"
                :size="size" @click="download(row)">下载</el-button>
        </template>
        <template v-slot:uploadForm="{size}">
            <el-upload ref="upload" name="file" :action="action" :headers="headers" :limit="1"
                :data="form" :show-file-list="yes" :multiple="no" :auto-upload="no"
                :with-credentials="yes" :on-change="change" :on-success="success" :on-error="error">
                <el-button :size="size" type="primary" icon="el-icon-upload">选择文件</el-button>
            </el-upload>
        </template>
    </avue-crud>
</template>

<script>
import { Common } from "cby.assist";
import { mapGetters } from 'vuex';
import AppVersionApi from '@/api/sys/AppVersionApi';
import AttachApi from '@/api/sys/AttachApi';

export default {
    data() {
        return {
            data: [],
            form: {},
            done: null,
            loading: null,
            uploadFile: null,
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            downloadParam: {
                domainId: 'sys_app_version',
                targetId: null
            }
        };
    },
    computed: {
        ...mapGetters(['getUser']),
        option() {
            return {
                border: true,
                viewBtn: true,
                editBtn: false,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                column: [{
                    label: '应用编号',
                    prop: 'appId',
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '版本号',
                    prop: 'versionNo',
                    rules: [{
                        required: true,
                        message: '版本号不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '版本序列',
                    prop: 'versionSerial',
                    addDisplay: false,
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '上传文件',
                    prop: 'upload',
                    formslot: true,
                    viewDisplay: false,
                    hide: true
                }, {
                    label: '内容描述',
                    prop: 'content',
                    type: 'textarea',
                    rules: [{
                        max: 4000,
                        message: '最多4000个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '强制更新',
                    prop: 'enforce',
                    type: 'radio',
                    button: true,
                    valueDefault: false,
                    dicData: [{
                        label: '是',
                        value: true
                    }, {
                        label: '否',
                        value: false
                    }]
                }, {
                    label: '发布人',
                    prop: 'publisher',
                    addDisplay: false
                }, {
                    label: '发布时间',
                    prop: 'publishTime',
                    addDisplay: false
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('sys:appversion');
        },
        action() {
            return `${this.$config.baseUrl}${this.$config.basePath}/appVersion/save`;
        },
        headers() {
            return {token: Common.getCookie("token")};
        },
    },
    methods: {
        loadData(page) {
            AppVersionApi.page(Object.assign({
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
            this.done = done;
            this.loading = loading;
            this.form.publisher = this.getUser.userId;
            if (this.uploadFile && this.uploadFile.name) {
                this.$refs.upload.submit();
            }
        },
        del(row, index) {
            this.$confirm('确认删除该记录吗?', {
                type: 'warning'
            }).then(() => {
                AppVersionApi.del(row.id).then(result => {
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
                this.done && this.done();
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
        download(row) {
            this.downloadParam.targetId = row.id;
            AttachApi.find(this.downloadParam).then(result => {
                if (!result) {
                    this.$message.warning('未获取到附件信息，无法下载！');
                    return;
                }
                this.$download(result);
            });
        }
    }
}
</script>

<style scoped>
.el-main {
    padding: 0 20px;
}
</style>
