<template>
    <el-container>
        <el-aside width="200px">
            <el-tree :data="treeData" :props="treeProps" @node-click="treeClick"/>
        </el-aside>
        <el-main>
            <avue-crud :option="option" :data="data" :page="page" :permission="permission"
                @on-load="loadData" @refresh-change="loadData" @search-change="loadData"
                @row-save="add" @row-del="del" @row-update="mod" :before-open="open">
                <template v-slot:search>
                    <el-col :md="4">
                        <el-input placeholder="请输入关键字" v-model="param.keyword" clearable/>
                    </el-col>
                </template>
                <template v-slot:menu="{type, size, row}">
                    <el-button icon="el-icon-refresh-right" :type="type" :size="size"
                        @click="resetPwd(row)" v-if="$store.getters.isAuth('auth:user:pwd')">重置密码</el-button>
                </template>
            </avue-crud>
        </el-main>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import OrgApi from '@/api/sys/OrgApi';
import UserApi from '@/api/sys/UserApi';
import RoleApi from '@/api/sys/RoleApi';

export default {
    data() {
        return {
            treeProps: {
                label: 'orgName',
                value: 'orgId',
                children: 'children'
            },
            data: [],
            treeData: [{orgId: null, orgName: "全部"}],
            org: null,
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            param: {
                orgId: null,
                keyword: null
            },
            roleList: []
        };
    },
    computed: {
        ...mapGetters(['getUser', 'getOrg']),
        option() {
            return {
                border: true,
                viewBtn: true,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                menuWidth: 260,
                column: [{
                    label: '用户名',
                    prop: 'userId',
                    editDisabled: true,
                    rules: [{
                        required: true,
                        message: '用户名不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '真实姓名',
                    prop: 'realName',
                    rules: [{
                        required: true,
                        message: '真实姓名不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '机构编码',
                    prop: 'orgId',
                    addDisplay: false,
                    readonly: true,
                    hide: true
                }, {
                    label: '机构名称',
                    prop: 'orgName',
                    addDisplay: false,
                    readonly: true,
                    hide: true
                }, {
                    label: '角色',
                    prop: 'roleId',
                    type: 'select',
                    dicData: this.roleList,
                    clearable: true,
                    hide: true,
                    width: 150
                }, {
                    label: '性别',
                    prop: 'gender',
                    type: 'radio',
                    button: true,
                    valueDefault: '男',
                    dicData: [{
                        label: '男',
                        value: '男'
                    }, {
                        label: '女',
                        value: '女'
                    }],
                    width: 150
                }, {
                    label: '出生日期',
                    prop: 'birthday',
                    type: 'date',
                    format: 'yyyy-MM-dd',
                    valueFormat: 'yyyy-MM-dd'
                }, {
                    label: '手机号码',
                    prop: 'phone',
                    rules: [{
                        pattern: /^1[34578]\d{9}$/,
                        message: "电话号码格式错误",
                        trigger: "blur"
                    }, {
                        max: 16,
                        message: '最多16个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '联系地址',
                    prop: 'address',
                    rules: [{
                        max: 256,
                        message: '最多256个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '电子邮箱',
                    prop: 'email',
                    rules: [{
                        type: 'email',
                        message: '邮箱格式错误',
                        trigger: 'blur'
                    }, {
                        max: 128,
                        message: '最多128个字符',
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
            return this.$store.getters.getAuthData('auth:user');
        }
    },
    created() {
        OrgApi.tree().then(result => {
            if (result) {
                this.treeData.push(...result);
            }
        });
        RoleApi.list().then(result => {
            if (result && result.length) {
                this.roleList = result.map(({roleId, roleName}) => ({label: roleName, value: roleId}));
            }
        });
    },
    methods: {
        open(done, type) {
            if (type == 'add' && (this.org == null || !this.org.orgId)) {
                this.$message.warning('必须选择机构后才能新增用户！');
                return;
            }
            done();
        },
        treeClick(node) {
            this.org = node;
            this.param.orgId = node.orgId;
            this.loadData(this.page);
        },
        loadData(page) {
            if (!this.param.orgId && this.getOrg.orgType != 'platform') {
                this.param.orgId = this.getUser.orgId;
            }
            UserApi.page(Object.assign({
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
            if (this.org) {
                row.orgId = this.org.orgId;
                row.orgName = this.org.orgName;
            }
            UserApi.add(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('新增成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            UserApi.mod(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('修改成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        del(row, index) {
            if (row.userId == 'admin') {
                this.$message.warning('不能删除系统管理员！');
                return;
            }
            this.$confirm('确认删除该记录吗?', {
                type: 'warning'
            }).then(() => {
                UserApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData(this.page);
                    }
                });
            }).catch(() => {});
        },
        resetPwd(row) {
            if (row.userId == 'admin') {
                this.$message.warning('不能重置系统管理员的密码！');
                return;
            }
            this.$confirm('确认重置该用户的密码吗?', {
                type: 'warning'
            }).then(() => {
                UserApi.resetPwd(row).then(result => {
                    if (result) {
                        this.$message.success('重置成功！');
                    }
                });
            }).catch(() => {});
        },
    }
}
</script>

<style scoped>
.el-main {
    padding: 0 20px;
}
</style>
