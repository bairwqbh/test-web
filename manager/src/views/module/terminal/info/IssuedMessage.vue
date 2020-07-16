<template>
    <el-dialog width="500px" title="报文下发" :visible="visible"
        @open="open" @close="$emit('close')"
        :close-on-click-modal="no" :close-on-press-escape="no">
        <avue-form ref="form" v-model="form" :option="option" @submit="submit"/>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import TerminalApi from '@/api/terminal/TerminalApi';

export default {
    data() {
        return {
            form: {},
        }
    },
    props: {
        visible: Boolean,
        data: Object,
    },
    computed: {
        ...mapGetters(['dictList']),
        gatewayDict() {
            if (this.data && this.data.state && this.data.state.gateway && this.data.state.gateway.length) {
                return this.dictList['gateway_type'].filter(({value}) => this.data.state.gateway.includes(value));
            }
            return this.dictList['gateway_type'];
        },
        option() {
            return {
                column: [{
                    label: '终端编号',
                    prop: 'terminalId',
                    readonly: true,
                    span: 24,
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }],
                }, {
                    label: '传输网关',
                    prop: 'gateway',
                    type: 'select',
                    dicData: this.gatewayDict,
                    clearable: false,
                    span: 24,
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }],
                }, {
                    label: '数据格式',
                    prop: 'format',
                    type: 'select',
                    dicData: this.dictList['message_format'],
                    valueDefault: 'hex',
                    clearable: false,
                    span: 24,
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }],
                }, {
                    label: '报文内容',
                    prop: 'content',
                    type: 'textarea',
                    span: 24,
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }, {
                        max: 4000,
                        message: '最多4000个字符',
                        trigger: 'blur'
                    }],
                }],
            };
        },
    },
    methods:{
        open() {
            this.$refs.form && this.$refs.form.resetForm();
            if (!this.data) {
                return;
            }
            this.form.terminalId = this.data.terminalId;
            if (this.data.state && this.data.state.gateway && this.data.state.gateway.length == 1) {
                this.form.gateway = this.data.state.gateway[0];
            }
        },
        submit(form, done) {
            if (!form.terminalId) {
                form.terminalId = this.data.sn;
            }
            TerminalApi.messageIssued(form).then(result => {
                done();
                if (result) {
                    this.$message.success('操作完成！');
                }
            }).catch(error => done());
        },
    },
}
</script>

<style scoped>

</style>
