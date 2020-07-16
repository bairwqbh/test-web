<template>
    <ul class="infinite-list" v-show="visible" v-infinite-scroll="scroll">
        <li class="infinite-list-item" v-for="item in list" @click="select(item)">
            <slot name="item" v-bind:item="item">{{ item }}</slot>
        </li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            show: true,
            list: [],
            scrollable: true,
        };
    },
    props: {
        visible: {
            type: Boolean,
            default: true,
        },
        data: Array,
    },
    watch: {
        data(value) {
            this.list = [];
            if (value && value.length) {
                this.list.push(...value);
                if (!this.scrollable) {
                    this.scrollable = true;
                }
            }
        },
    },
    methods: {
        scroll() {
            this.scrollable && this.$emit('scroll', this.load);
        },
        load(data) {
            if (data && data.length) {
                this.list.push(...data);
            } else {
                this.scrollable = false;  
            }
        },
        select(item) {
            this.$emit('select', item);
        },
    },
}
</script>

<style scoped>
.infinite-list {
    padding: 0;
    margin: 0;
    list-style: none;
    border-radius: 4px;
    overflow: auto;
}

.infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 35px;
    background: white;
    color: #606266;
}

.infinite-list .infinite-list-item:hover { 
    background: #e8f3fe;
}
</style>
