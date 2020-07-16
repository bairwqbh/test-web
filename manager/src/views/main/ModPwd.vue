<template>
    <div class="wrapper">
        <el-dialog title="修改密码" :visible="isShow" @open="open" @close="$emit('close')" width="350px"
            :close-on-click-modal="closeOn" :close-on-press-escape="closeOn">
            <avue-form ref="form" :option="option" v-model="formData" @submit="submit"/>
        </el-dialog>
    </div>
</template>

<script>
import SystemApi from '@/api/SystemApi';

export default {
    data() {
        return {
            closeOn: false,
            formData: {},
        };
    },
    props: {
        isShow: Boolean
    },
    computed: {
        option() {
            return {
                column: [{
                    label: '旧密码',
                    prop: 'oldPwd',
                    type: 'password',
                    span: 24,
                    rules: [{
                        required: true,
                        message: '旧密码不能为空',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        max: 24,
                        message: "请输入6-24位的密码"
                    }],
                    row: true,
                }, {
                    label: '新密码',
                    prop: 'newPwd',
                    type: 'password',
                    span: 24,
                    rules: [{
                        required: true,
                        message: '旧密码不能为空',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        max: 24,
                        message: "请输入6-24位的密码"
                    }],
                    row: true,
                }, {
                    label: '确认密码',
                    prop: 'cfmPwd',
                    type: 'password',
                    span: 24,
                    rules: [{
                        required: true,
                        message: '旧密码不能为空',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        max: 24,
                        message: "请输入6-24位的密码"
                    }],
                    row: true,
                }]
            }
        }
    },
    methods: {
        open() {
            this.$refs.form && this.$refs.form.resetForm();
        },
        submit(form, done) {
            if (this.formData.newPwd != this.formData.cfmPwd) {
                this.$message.error('确认密码不一致！');
                return false;
            }
            SystemApi.modPwd(this.formData).then(result => {
                done();
                if (result) {
                    this.$message.success('密码修改成功！');
                    this.$emit('close');
                }
            });
        }
    }
}
</script>

<style scoped>
.wrapper {
    line-height: 0px;
}

.el-dialog__wrapper >>> .el-dialog__body {
    padding: 30px 20px 10px 20px;
}

.el-dialog__wrapper >>> .avue-group__item {
    padding: 0px;
}
</style>
