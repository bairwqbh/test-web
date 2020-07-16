<template>
    <avue-crud :option="option" :data="data" :page="page"
        @on-load="loadData" :permission="permission"
        @refresh-change="loadData" @search-change="loadData"
        @row-save="add" @row-del="del" @row-update="mod">
        <template v-slot:search>
            <el-col :md="4">
                <el-input placeholder="请输入关键字" v-model="param.keyword" clearable/>
            </el-col>
        </template>
    </avue-crud>
</template>

<script>
import { mapGetters } from 'vuex';
import BucketApi from '@/api/sys/BucketApi';

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
                keyword: null
            }
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
                column: [{
                    label: '存储板块',
                    prop: 'bucket',
                    editDisabled: true,
                    rules: [{
                        required: true,
                        message: '存储板块不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '板块名称',
                    prop: 'name',
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '存储类型',
                    prop: 'storage',
                    type: 'select',
                    dicData: this.dictList['storage_type'],
                    readonly: true,
                    rules: [{
                        required: true,
                        message: '存储类型不能为空',
                        trigger: 'blur'
                    }]
                }, {
                    label: '附件数量',
                    prop: 'count',
                    addDisplay: false,
                    readonly: true
                }, {
                    label: '描述',
                    prop: 'description',
                    type: 'textarea',
                    rules: [{
                        max: 256,
                        message: '最多256个字符',
                        trigger: 'blur'
                    }]
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('sys:bucket');
        }
    },
    methods: {
        loadData(page) {
            BucketApi.page(Object.assign({
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
            BucketApi.add(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('新增成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            BucketApi.mod(row).then(result => {
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
                BucketApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData(this.page);
                    }
                });
            }).catch(() => {});
        }
    }
}
</script>

<style scoped>

</style>
