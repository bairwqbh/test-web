<template>
    <el-dialog title="接口权限" :visible="isShow" @open="open" @close="close"
        :close-on-click-modal="no" :close-on-press-escape="no">
        <el-tree :data="treeData" :props="treeProps"
            ref="tree" node-key="apiId" show-checkbox
            :default-checked-keys="auth.targetList"
            :render-content="renderContent"/>
        <template v-slot:footer>
            <el-button type="primary" @click="sure">确定</el-button>
            <el-button @click="close">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import ApiApi from '@/api/sys/ApiApi';
import AuthApi from '@/api/sys/AuthApi';
import RelateApi from '@/api/sys/RelateApi';

export default {
    data() {
        return {
            treeProps: {
                label: 'apiName',
                children: 'children'
            },
            treeData: [],
            auth: {
                authType: 'api',
                relateType: 'func_api',
                authMode: 'in',
                targetList: []
            }
        };
    },
    props: {
        isShow: Boolean,
        data: Object
    },
    created() {
        ApiApi.tree().then(result => {
            if (result) {
                this.treeData = result;
            }
        });
    },
    methods: {
        renderContent(h, { node, data, store }) {
            return (<span>
                <span>{ node.label }</span>
                <span style="margin-left: 60px;">{ data.url }</span>
            </span>);
        },
        open() {
            this.auth.objectId = this.data.funcId;
            this.auth.objectName = this.data.funcName;
            this.auth.targetList = [];
            RelateApi.getTargetList(this.data.funcId, this.auth.relateType).then(result => {
                if (result) {
                    this.auth.targetList = result;
                }
            });
        },
        sure() {
            this.auth.targetList = this.$refs.tree.getCheckedKeys();
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

</style>
