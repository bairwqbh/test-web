<template>
    <div class="wrapper">
        <el-dialog title="用户信息" :visible="isShow" @close="$emit('close')" width="450px"
            :close-on-click-modal="closeOn" :close-on-press-escape="closeOn">
            <avue-detail :option="option" v-model="getUser"/>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            closeOn: false,
            option: {
                column: [{
                    label: '用户名',
                    prop: 'userId',
                    row: true,
                    span: 24,
                }, {
                    label: '真实姓名',
                    prop: 'realName',
                    row: true,
                    span: 24,
                }, {
                    label: '性别',
                    prop: 'gender',
                    row: true,
                    span: 24,
                }, {
                    label: '出生日期',
                    prop: 'birthday',
                    row: true,
                    span: 24,
                }, {
                    label: '地址',
                    prop: 'address',
                    row: true,
                    span: 24,
                }, {
                    label: '电话',
                    prop: 'phone',
                    row: true,
                    span: 24,
                }, {
                    label: '邮箱',
                    prop: 'email',
                    row: true,
                    span: 24,
                }]
            }
        }
    },
    props: {
        isShow: Boolean
    },
    computed: {
        ...mapGetters(['getUser'])
    }
}
</script>

<style scoped>
.wrapper {
    line-height: 0px;
}

.el-dialog__wrapper> >> .el-dialog__body {
    padding: 10px;
}
</style>
