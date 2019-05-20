<template>
    <div class="input-box">
        <a-icon :type="icon" 
            :style="{position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', color: '#666'}"/>
        <input ref="input" :type="type" :placeholder="placeholder" @change="handelChange"/>
    </div>
</template>

<script>
import Vue from "vue";
import {Icon} from "ant-design-vue";
Vue.use(Icon);
// export default class Input extends Vue {
export default {
    props: {
        icon: {
            type: String,
            default: "user"
        },
        type: {
            type: String,
            default: "text"
        },
        id: {
            type: String,
            default: ""
        },
        placeholder: "",
    },
    data() {
        return {
            value: ""
        }
    },
    methods: {
        handelChange(e) {
            // console.log(val);
            this.value = e.target.value;
            
        },
        //赋值操作
        setValue(value) {
            this.value = value;
            this.$refs.input.value = value;
        }
    },
}
</script>
<style lang="scss" scoped>
.input-box {
    display: flex;
    align-items: center;
    position: relative;
    // margin-bottom: 10px;

    span {
        font-size: 14px;
        color: #666;
        display: block;
        width: 150px;
    }
    &>input {
        display: block;
        border: 1px solid #ddd;
        outline: none;
        height: 30px;
        width: 200px;
        border-radius: 3px;
        box-sizing: border-box;
        padding: 0 25px;
    }
}
</style>
