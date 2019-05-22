<template>
    <div class="login-box">
        <div class="title">
            <a-icon type="file-text" />
            <span>Todo List</span>
        </div>
        <Form ref="form">
            <Input id="account" />
            <Input type="password" icon="lock" id="password" />
        </Form>
        <div class="btn-box">
            <span @click="login">Sign in</span>
        </div>
    </div>
</template>
<script>
import Form from "../../components/form";
import Input from "../../components/form/input";
import Vue from "vue";
import {Button, message} from "ant-design-vue";
import md5 from "js-md5";
Vue.use(Button);
export default {
    components: {
        Form,
        Input
    },
    methods: {
        async login() {
            let {account, password} = this.$refs.form.getValues();
            let res = await this.$store.dispatch("login", {
                account,
                password: md5(password)
            });
            if (res.returnCode === 1) {
                this.$router.push("/home");
            } else {
                message.open({
                    content: data.data.message,
                    duration: 2
                });
            }
        },
        async autoLogin() {
            //自动登录
            let res = await this.$store.dispatch("autoLogin");
            if (res.returnCode === 1) {
                this.$router.push("/home");
            }
        }
    },
    mounted() {
        this.autoLogin();
    }
}
</script>
<style lang="scss" scoped>
.login-box {
    width: 100%;
    height: 100%;
    background: #f1f1f1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    .title {
        display: flex;
        align-items: center;
        height: 20px;
        transform: translateY(-30px);
        span {
            margin-left: 10px;
            transform: translateY(-2px);
        }
    }

    .btn-box {
        box-sizing: border-box;
        padding: 0 5px;
        width: 200px;
        display: flex;
        justify-content: flex-end;
        // justify-content: center;
        height: 30px;
        align-items: center;
        font-size: 12px;
        cursor: pointer;
    }
}
</style>

