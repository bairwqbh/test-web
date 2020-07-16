<template>
    <el-container>
        <el-aside width="200px">
            <avue-crud :data="bucketData" :option="bucketOption" @row-click="nodeClick"/>
        </el-aside>
        <el-main>
            <avue-crud ref="crud" :option="option" :data="data" :page="page" :permission="permission" 
                @on-load="loadData" @refresh-change="loadData" @search-change="loadData"
                @row-save="add" @row-del="del" @row-update="mod" :before-open="open">
                <template v-slot:menu="{type, size, row}">
                    <el-button icon="el-icon-download" :type="type"
                        :size="size" @click="$download(row)">下载</el-button>
                </template>
                <template v-slot:search>
                    <el-col :md="4">
                        <el-input placeholder="请输入关键字" v-model="param.keyword" clearable/>
                    </el-col>
                </template>
            </avue-crud>
        </el-main>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import BucketApi from '@/api/sys/BucketApi';
import AttachApi from '@/api/sys/AttachApi';

export default {
    data() {
        return {
            data: [],
            bucketData: [{bucket: "all", name: "全部"}],
            bucket: null,
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            param: {
                bucket: null,
                keyword: null
            }
        };
    },
    computed: {
        ...mapGetters(['dictList']),
        bucketOption() {
            return {
                border: true,
                addBtn: false,
                menu: false,
                header: false,
                highlightCurrentRow: true,
                column: [{
                    label: '板块',
                    prop: 'name',
                }],
            };
        },
        option() {
            return {
                border: true,
                addBtn: false,
                header: false,
                viewBtn: true,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                menuWidth: 260,
                column: [{
                    label: '模型标识',
                    prop: 'domainId',
                    editDisabled: true,
                    hide: true,
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '目标编号',
                    prop: 'rowId',
                    editDisabled: true,
                    hide: true,
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '字段标识',
                    prop: 'fieldId',
                    editDisabled: true,
                    hide: true,
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '原名称',
                    prop: 'originalName',
                    rules: [{
                        max: 64,
                        message: '最多64个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '真实名称',
                    prop: 'name',
                    width: 300,
                    addDisplay: false,
                    readonly: true
                }, {
                    label: '附件类型',
                    prop: 'type',
                    width: 100,
                    addDisplay: false,
                    readonly: true
                }, {
                    label: '附件大小',
                    prop: 'size',
                    width: 100,
                    addDisplay: false,
                    readonly: true
                }, {
                    label: '存储类型',
                    prop: 'storage',
                    type: 'select',
                    width: 160,
                    dicData: this.dictList['storage_type'],
                    editDisabled: true,
                    rules: [{
                        required: true,
                        message: '存储类型不能为空',
                        trigger: 'blur'
                    }]
                }, {
                    label: '存储板块',
                    prop: 'bucket',
                    width: 160,
                    addDisplay: false,
                    readonly: true
                }, {
                    label: '板块名称',
                    prop: 'bucketName',
                    width: 160,
                    addDisplay: false,
                    readonly: true
                }, {
                    label: '预签名地址',
                    prop: 'presignedUrl',
                    addDisplay: false,
                    readonly: true,
                    hide: true,
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('sys:attach');
        }
    },
    created() {
        BucketApi.list().then(result => {
            if (result) {
                this.bucketData.push(...result);
            }
        });
    },
    methods: {
        open(done, type) {
            if (type == 'add' && (!this.bucket || !this.bucket.bucket || this.bucket.bucket == 'all')) {
                this.$message.warning('必须选择存储板块后才能新增附件！');
                return;
            }
            done();
        },
        nodeClick(node) {
            this.bucket = node;
            this.param.bucket = node.bucket;
            this.loadData(this.page);
        },
        loadData(page) {
            if (this.param.bucket == 'all') {
                this.param.bucket = null; 
            }
            AttachApi.page(Object.assign({
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
            if (this.bucket) {
                row.bucket = this.bucket.bucket;
                row.bucketName = this.bucket.name;
            }
            AttachApi.add(row).then(result => {
                if (result) {
                    this.loadData(this.page);
                    this.$message.success('新增成功！');
                    done();
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            AttachApi.mod(row).then(result => {
                if (result) {
                    this.loadData(this.page);
                    this.$message.success('修改成功！');
                    done();
                }
            }).catch(() => loading());
        },
        del(row, index) {
            this.$confirm('确认删除该记录吗?', {
                type: 'warning'
            }).then(() => {
                AttachApi.del(row.id).then(result => {
                    if (result) {
                        this.loadData(this.page);
                        this.$message.success('删除成功！');
                    }
                });
            }).catch(() => {});
        }
    }
}
</script>

<style scoped>
.el-main {
    padding: 0 20px;
}
</style>
