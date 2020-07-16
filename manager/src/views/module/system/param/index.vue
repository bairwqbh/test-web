<template>
    <avue-crud :option="option" :data="data" :page="page"
        :permission="permission" @on-load="loadData"
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
import ParamApi from '@/api/sys/ParamApi';

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
        option() {
            return {
                border: true,
                viewBtn: true,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                column: [{
                    label: '参数键',
                    prop: 'paramKey',
                    width: 200,
                    rules: [{
                        required: true,
                        message: '参数键不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '参数名称',
                    prop: 'paramLabel',
                    width: 200,
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '参数值',
                    prop: 'paramValue',
                    type: 'textarea',
                    width: 200,
                    rules: [{
                        max: 1000,
                        message: '最多1000个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '描述',
                    prop: 'description',
                    type: 'textarea',
                    rules: [{
                        max: 256,
                        message: '最多256个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '是否启用',
                    prop: 'enable',
                    type: 'radio',
                    width: 100,
                    button: true,
                    valueDefault: true,
                    dicData: [{
                        label: '启用',
                        value: true
                    }, {
                        label: '禁用',
                        value: false
                    }]
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('sys:param');
        }
    },
    methods: {
        loadData(page) {
            ParamApi.page(Object.assign({
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
            ParamApi.add(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('新增成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            ParamApi.mod(row).then(result => {
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
                ParamApi.del(row.id).then(result => {
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
