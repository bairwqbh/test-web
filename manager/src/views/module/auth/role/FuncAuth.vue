<template>
    <el-dialog title="功能权限" :visible="isShow" @open="open" @close="close"
        :close-on-click-modal="no" :close-on-press-escape="no">
        <el-form label-width="100px">
            <el-form-item label="权限模式">
                <el-radio-group v-model="auth.authMode">
                    <el-radio-button label="none">无</el-radio-button>
                    <el-radio-button label="in">包含</el-radio-button>
                    <el-radio-button label="exc">排他</el-radio-button>
                    <el-radio-button label="all">全部</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="功能列表" v-show="isBind">
                <el-tree :data="treeData" :props="treeProps"
                    ref="tree" node-key="funcId" show-checkbox class="dialog-info-body"/>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <el-button type="primary" @click="sure">确定</el-button>
            <el-button @click="close">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import FuncApi from '@/api/sys/FuncApi';
import AuthApi from '@/api/sys/AuthApi';

export default {
    data() {
        return {
            treeProps: {
                label: 'funcName',
                children: 'children'
            },
            treeData: [],
            auth: {
                authType: 'func',
                relateType: 'role_func',
                authMode: 'none',
                targetList: []
            }
        };
    },
    props: {
        isShow: Boolean,
        data: Object
    },
    computed: {
        isBind() {
            return this.auth.authMode != 'none' && this.auth.authMode != 'all';
        }
    },
    created() {
        FuncApi.tree().then(result => {
            if (result) {
                this.treeData = result;
            }
        });
    },
    methods: {
        open() {
            this.auth.objectId = this.data.roleId;
            this.auth.objectName = this.data.roleName;
            this.auth.authMode = 'none';
            this.auth.targetList = [];
            if (this.$refs.tree) {
                this.$refs.tree.setCheckedKeys([]);
            }
            AuthApi.getAuth(this.data.roleId, 'role_func').then(result => {
                if (result) {
                    this.auth.authMode = result.authMode;
                    if (result.targetList) {
                        this.auth.targetList = result.targetList;
                        let checks = result.targetList.filter(funcId => this.$refs.tree.getNode(funcId).childNodes.length == 0);
                        this.$refs.tree.setCheckedKeys(checks);
                    }
                }
            });
        },
        sure() {
            if (this.isBind) {
                this.auth.targetList = [...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()];
            } else {
                this.auth.targetList = [];
            }
            AuthApi.authorize(this.auth).then(result => {
                this.$message.success('操作成功！');
                this.close();
            });
        },
        close() {
            this.$emit("close");
        }
    }
}
</script>

<style scoped>
.dialog-info-body {
    max-height: 50vh;
    overflow-y: auto;
}
</style>
