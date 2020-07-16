<template>
    <el-container>
        <avue-crud ref="crud" :option="option" :data="data"
            @on-load="loadData" @refresh-change="loadData" :permission="permission"
            @row-save="add" @row-del="del" @row-update="mod" :before-close="close">
            <template v-slot:search>
                <el-col :md="4">
                    <el-select v-model="param.sysId" @change="loadData" placeholder="请选择系统">
                        <el-option v-for="item in dictList.system_flag"
                            :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-col>
            </template>
            <template v-slot:menu="{type, size, row}">
                <el-button icon="el-icon-plus" :type="type" :size="size"
                    @click="addChild(row)" v-if="permission.addBtn">新增子集</el-button>
                <el-button icon="el-icon-top" :type="type" :size="size"
                    @click="up(row)" v-if="permission.editBtn">上移</el-button>
                <el-button icon="el-icon-bottom" :type="type" :size="size"
                    @click="down(row)" v-if="permission.editBtn">下移</el-button>
                <el-button :type="type" :size="size" icon="el-icon-setting"
                    @click="auth(row)" v-if="$store.getters.isAuth('auth:func:api')">接口权限</el-button>
            </template>
        </avue-crud>
        <api-auth :isShow="authShow" :data="row" @close="close"/>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import FuncApi from '@/api/sys/FuncApi';
import { elicons } from '@/assets/js/icons';
import ApiAuth from './ApiAuth';

export default {
    data() {
        return {
            data: [],
            parentId: null,
            param: {
                sysId: 'manager'
            },
            authShow: false,
            row: null,
            funcType: null,
        };
    },
    computed: {
        ...mapGetters(['dictList']),
        menuShow() {
            return this.funcType == 'dir' || this.funcType == 'menu';
        },
        btnShow() {
            return this.funcType == 'btn';
        },
        option() {
            return {
                maxHeight: 700,
                border: true,
                viewBtn: true,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                menuWidth: 450,
                column: [{
                    label: '功能编号',
                    prop: 'funcId',
                    editDisabled: true,
                    hide: true,
                    width: 200,
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '功能名称',
                    prop: 'funcName',
                    rules: [{
                        required: true,
                        message: '功能名称不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '功能类型',
                    prop: 'funcType',
                    type: 'select',
                    dicData: this.dictList['func_type'],
                    clearable: false,
                    width: 100,
                    change: ({value}) => this.funcType = value,
                }, {
                    label: '所属系统',
                    prop: 'sysId',
                    readonly: true,
                    addDisplay: false,
                    dicData: this.dictList['system_flag']
                }, {
                    width: 100,
                    label: '图标',
                    prop: 'icon',
                    type: 'icon-select',
                    display: this.menuShow,
                    iconList: [{
                        label: '基本图标',
                        list: elicons
                    }],
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    width: 200,
                    label: '链接路径',
                    prop: 'path',
                    display: this.menuShow,
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }, {
                        max: 64,
                        message: '最多64个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '认证标识',
                    prop: 'auth',
                    display: this.btnShow,
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    width: 100,
                    label: '是否显示',
                    prop: 'display',
                    type: 'radio',
                    button: true,
                    valueDefault: true,
                    dicData: [{
                        label: '显示',
                        value: true
                    }, {
                        label: '隐藏',
                        value: false
                    }]
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('auth:func');
        }
    },
    methods: {
        close(done, type) {
            this.parentId = null;
            done();
        },
        loadData() {
            FuncApi.tree(this.param).then(result => {
                if (result) {
                    this.data = result;
                } else {
                    this.data = [];
                }
            });
        },
        add(row, done, loading) {
            if (this.parentId) {
                row.parentId = this.parentId;
            }
            row.sysId = this.param.sysId;
            FuncApi.add(row).then(result => {
                if (result) {
                    this.parentId = null;
                    done();
                    this.$message.success('新增成功！');
                    this.loadData();
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            FuncApi.mod(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('修改成功！');
                    this.loadData();
                }
            }).catch(() => loading());
        },
        del(row, index) {
            this.$confirm('确认删除该记录吗?', {
                type: 'warning'
            }).then(() => {
                FuncApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData();
                    }
                });
            }).catch(() => {});
        },
        addChild(row) {
            this.parentId = row.funcId;
            this.$refs.crud.rowAdd();
        },
        up(row) {
            FuncApi.up(row).then(result => {
                if (result) {
                    this.$message.success('上移完成！');
                    this.loadData();
                }
            });
        },
        down(row) {
            FuncApi.down(row).then(result => {
                if (result) {
                    this.$message.success('下移完成！');
                    this.loadData();
                }
            });
        },
        auth(row) {
            this.row = row;
            this.authShow = true;
        },
        close() {
            this.authShow = false;
        }
    },
    components: { ApiAuth }
}
</script>

<style scoped>

</style>
