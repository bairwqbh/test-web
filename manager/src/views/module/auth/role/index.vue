<template>
    <el-container>
        <avue-crud :option="option" :data="data"
           :page="page" :permission="permission"
            @on-load="loadData" @refresh-change="loadData"
            @row-save="add" @row-del="del" @row-update="mod">
            <template v-slot:menu="{type, size, row}">
                <el-button :type="type" :size="size" icon="el-icon-setting"
                    @click="auth(row)" v-if="$store.getters.isAuth('auth:role:func')">功能权限</el-button>
            </template>
        </avue-crud>
        <func-auth :isShow="authShow" :data="row" @close="close"/>
    </el-container>
</template>

<script>
import RoleApi from '@/api/sys/RoleApi';
import FuncAuth from './FuncAuth';

export default {
    data() {
        return {
            data: [],
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            authShow: false,
            row: null
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
                menuWidth: 260,
                column: [{
                    label: '角色编码',
                    prop: 'roleId',
                    width: 200,
                    editDisabled: true,
                    rules: [{
                        required: true,
                        message: '角色编码不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '角色名称',
                    prop: 'roleName',
                    rules: [{
                        required: true,
                        message: '角色名称不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
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
                    button: true,
                    valueDefault: true,
                    dicData: [{
                        label: '启用',
                        value: true
                    }, {
                        label: '禁用',
                        value: false
                    }],
                    width: 150
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('auth:role');
        }
    },
    methods: {
        loadData(page) {
            RoleApi.page({
                page: page.currentPage,
                size: page.pageSize
            }).then(result => {
                if (result.list) {
                    this.data = result.list;
                } else {
                    this.data = [];
                }
                this.page.total = result.total;
            });
        },
        add(row, done, loading) {
            RoleApi.add(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('新增成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            RoleApi.mod(row).then(result => {
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
                RoleApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData(this.page);
                    }
                });
            }).catch(() => {});
        },
        auth(row) {
            this.row = row;
            this.authShow = true;
        },
        close() {
            this.authShow = false;
        }
    },
    components: { FuncAuth }
}
</script>

<style scoped>

</style>
