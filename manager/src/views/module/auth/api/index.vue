<template>
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
        </template>
    </avue-crud>
</template>

<script>
import { Common } from 'cby.assist';
import { mapGetters } from 'vuex';
import ApiApi from '@/api/sys/ApiApi';

export default {
    data() {
        return {
            data: [],
            parentId: null,
            param: {
                sysId: 'manager'
            }
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
                menuWidth: 260,
                column: [{
                    label: '接口编号',
                    prop: 'apiId',
                    width: 200,
                    addDisplay: false,
                    readonly: true,
                    rules: [{
                        required: true,
                        message: '接口编号不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '接口名称',
                    prop: 'apiName',
                    rules: [{
                        required: true,
                        message: '接口名称不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '接口地址',
                    prop: 'url',
                    rules: [{
                        max: 256,
                        message: '最多256个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '所属系统',
                    prop: 'sysId',
                    readonly: true,
                    addDisplay: false,
                    dicData: this.dictList['system_flag']
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
            return this.$store.getters.getAuthData('auth:api');
        }
    },
    methods: {
        close(done, type) {
            this.parentId = null;
            done();
        },
        loadData() {
            ApiApi.tree(this.param).then(result => {
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
            this.setDesc(row);
            ApiApi.add(row).then(result => {
                if (result) {
                    this.parentId = null;
                    done();
                    this.$message.success('新增成功！');
                    this.loadData();
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            ApiApi.mod(row).then(result => {
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
                ApiApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData();
                    }
                });
            }).catch(() => {});
        },
        addChild(row) {
            this.parentId = row.apiId;
            this.$refs.crud.rowAdd();
        },
        setDesc(row) {
            if (!row.description) {
                if (!row.parentId) {
                    row.description = row.apiName;
                } else {
                    let parent = Common.recursiveQuery(row.parentId, this.data, 'apiId');
                    if (parent) {
                        row.description = `${parent.description}-${row.apiName}`;
                    } 
                }
            }
            return row.description;
        }
    }
}
</script>

<style scoped>

</style>
