<template>
    <avue-crud ref="crud" :option="option" :data="data" :permission="permission"
        @on-load="loadData" @refresh-change="loadData" @row-save="add" @row-del="del" @row-update="mod">
        <template v-slot:menu="{type, size, row}">
            <el-button icon="el-icon-plus" :type="type" :size="size"
                @click="addChild(row)" v-if="permission.addBtn">新增子集</el-button>
            <el-button icon="el-icon-top" :type="type" :size="size"
                @click="up(row)" v-if="permission.editBtn">上移</el-button>
            <el-button icon="el-icon-bottom" :type="type" :size="size"
                @click="down(row)" v-if="permission.editBtn">下移</el-button>
        </template>
    </avue-crud>
</template>

<script>
import { mapGetters } from 'vuex';
import OrgApi from '@/api/sys/OrgApi';

export default {
    data() {
        return {
            data: [],
            parentId: null
        };
    },
    computed: {
        ...mapGetters(['dictList']),
        option() {
            return {
                maxHeight: 700,
                border: true,
                viewBtn: true,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                menuWidth: 380,
                column: [{
                    label: '机构编码',
                    prop: 'orgId',
                    width: 200,
                    editDisabled: true,
                    rules: [{
                        required: true,
                        message: '机构编码不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '机构名称',
                    prop: 'orgName',
                    rules: [{
                        required: true,
                        message: '机构名称不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '机构类型',
                    prop: 'orgType',
                    type: 'select',
                    dicData: this.dictList['org_type'],
                    clearable: false,
                    width: 150
                }, {
                    label: '联系人',
                    prop: 'person',
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '联系电话',
                    prop: 'tel',
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
                    label: '地址',
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
                    label: '传真',
                    prop: 'fax',
                    rules: [{
                        max: 16,
                        message: '最多16个字符',
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
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('auth:org');
        }
    },
    methods: {
        close(done, type) {
            this.parentId = null;
            done();
        },
        loadData() {
            OrgApi.tree().then(result => {
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
            OrgApi.add(row).then(result => {
                if (result) {
                    this.parentId = null;
                    done();
                    this.$message.success('新增成功！');
                    this.loadData();
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            OrgApi.mod(row).then(result => {
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
                OrgApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData();
                    }
                });
            }).catch(() => {});
        },
        addChild(row) {
            this.parentId = row.orgId;
            this.$refs.crud.rowAdd();
        },
        up(row) {
            OrgApi.up(row).then(result => {
                if (result) {
                    this.$message.success('上移完成！');
                    this.loadData();
                }
            });
        },
        down(row) {
            OrgApi.down(row).then(result => {
                if (result) {
                    this.$message.success('下移完成！');
                    this.loadData();
                }
            });
        }
    }
}
</script>

<style scoped>

</style>
