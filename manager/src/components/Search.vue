<template>
    <div>
        <el-input v-model="keyword" placeholder="请输入关键字" clearable
            @focus="search('focus')" @input="search('input')" @blur="blur"/>
        <scroll-load :visible="listShow" :data="list"
            @scroll="scroll" @select="select">
            <template v-slot:item="{item}">{{ showItem(item) }}</template>
        </scroll-load>
    </div>
</template>

<script>
import ScrollLoad from './ScrollLoad';

export default {
    data() {
        return {
            keyword: "",
            listShow: false,
            list: [],
            index: 0,
        };
    },
    props: {
        option: Object,
    },
    methods: {
        load(data) {
            if (data && data.length) {
                this.list = data;
            } else {
                this.list = [];
            }
        },
        search(type) {
            if (!this.listShow) {
                this.listShow = true;
            }
            if (type === 'focus' && this.list.length) {
                return;
            }
            this.index = 1;
            this.$emit('search', this.keyword, data => this.list = data);
        },
        scroll(callback) {
            if (!this.index) {
                return;
            }
            this.index += 1;
            this.$emit('scroll', this.keyword, this.index, data => callback(data));
        },
        showItem(item) {
            if (this.option) {
                if (this.option.format) {
                    return this.option.format(item);
                } else if (this.option.label) {
                    return item[this.option.label];
                }
            }
            return item;
        },
        select(item) {
            this.$emit('select', item);
        },
        blur() {
            setTimeout(() => this.listShow = false, 200);
        },
    },
    components: { ScrollLoad }
}
</script>

<style scoped>
.infinite-list {
    max-height: 349px;
} 
</style>
