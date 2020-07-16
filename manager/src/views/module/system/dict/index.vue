<template>
    <avue-crud ref="crud" :option="option" :data="getDict"
        :permission="permission" :before-close="close"
        @row-save="add" @row-del="del" @row-update="mod">
        <template v-slot:menu="{type, size, row}">
            <el-button icon="el-icon-plus" :type="type" :size="size"
                v-if="permission.addBtn && (row.parentId == '-' || row.parentId == '0')"
                @click="addChild(row)">新增子集</el-button>
            <el-button icon="el-icon-top" :type="type" :size="size"
                @click="up(row)" v-if="permission.editBtn">上移</el-button>
            <el-button icon="el-icon-bottom" :type="type" :size="size"
                @click="down(row)" v-if="permission.editBtn">下移</el-button>
        </template>
    </avue-crud>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DictApi from '@/api/sys/DictApi';

export default {
    data() {
        return {
            parentId: null
        };
    },
    computed: {
        ...mapGetters(['getDict']),
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
                    label: '字典编码',
                    prop: 'code',
                    editDisabled: true,
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '字典名称',
                    prop: 'name',
                    rules: [{
                        required: true,
                        message: '不能为空',
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
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('sys:dict');
        }
    },
    methods: {
        ...mapActions(['loadDict']),
        close(done, type) {
            this.parentId = null;
            done();
        },
        add(row, done, loading) {
            if (this.parentId) {
                row.parentId = this.parentId;
            }
            DictApi.add(row).then(result => {
                if (result) {
                    this.parentId = null;
                    done();
                    this.$message.success('新增成功！');
                    this.loadDict();
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            DictApi.mod(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('修改成功！');
                    this.loadDict();
                }
            }).catch(() => loading());
        },
        del(row, index) {
            this.$confirm('确认删除该记录吗?', {
                type: 'warning'
            }).then(() => {
                DictApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadDict();
                    }
                });
            }).catch(() => {});
        },
        addChild(row) {
            this.parentId = row.code;
            this.$refs.crud.rowAdd();
        },
        up(row) {
            DictApi.up(row).then(result => {
                if (result) {
                    this.$message.success('上移完成！');
                    this.loadDict();
                }
            });
        },
        down(row) {
            DictApi.down(row).then(result => {
                if (result) {
                    this.$message.success('下移完成！');
                    this.loadDict();
                }
            });
        }
    }
}
</script>

<style scoped>

</style>
