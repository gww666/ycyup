<template>
    <div class="list-box">
        <div class="header">
            <div class="filter-box">
                <span :style="[{color: index === filterBtnIndex ? '#1890ff' : '#666'}]"
                    @click="filter(index, item)"
                    @selectstart="stop($event)"
                    v-for="(item, index) in filterBtn" :key="index">
                    {{item.type}}
                </span>
            </div>
            <div class="handle-box">
                <span class="add" @click="add">add</span>
                <a-input placeholder="user" v-model="userName" 
                    ref="userNameInput"
                    style="width: 200px; border-radius: 20px;">
                    <a-icon slot="prefix" type="search" />
                    <a-icon v-if="userName" slot="suffix" type="close-circle" @click="emitEmpty" />
                </a-input>
            </div>
        </div>
        <!-- 分割线 -->
        <div class="line"></div>
        <a-list
            class="demo-loadmore-list"
            :loading="loading"
            itemLayout="horizontal"
            :dataSource="todoList">
            <!-- 点击加载更多的按钮 -->
            <div v-if="showLoadingMore" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                <a-spin v-if="loadingMore" />
                <a-button v-else @click="onLoadMore">loading more</a-button>
            </div>
            <!-- 每一个列表项 -->
            <a-list-item slot="renderItem" slot-scope="item">
                <div slot="actions" style="display: flex; align-items: center;min-width: 60px;justify-content: center;">
                    <a v-if="item.state === 1" @click="complete(item)">complete</a>
                    <a-icon type="check" style="color: green;font-size: 20px;" v-else-if="item.state === 2" />
                    <a-icon type="info-circle" style="color: orange;font-size: 20px;" v-else-if="item.state === 3" />
                </div>
                <!-- more下拉菜单 -->
                <a slot="actions">
                    <a-dropdown>
                        <a class="ant-dropdown-link" href="#">
                            more<a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item v-if="item.state === 1">
                                <a href="javascript:;" @click="add(item)">edit</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;" @click="deleteItem(item)">delete</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </a>
                <a-list-item-meta
                    :description="item.content">
                    <!-- 标题 -->
                    <a slot="title">{{item.title}}</a>
                    <!-- 头像和昵称 -->
                    <div slot="avatar" class="photo">
                        <a-avatar :src="item.photo" />
                        <!-- 昵称 -->
                        <span class="nickname">{{item.nickname || item.account}}</span>
                    </div>
                </a-list-item-meta>
                <!-- 日期 -->
                <div title="创建时间 / 完成时间">
                    <span :style="[item.state === 3 ? {color: 'red'}: {}]">{{item.createDate}} / {{item.endDate}}</span>
                </div>
            </a-list-item>
        </a-list>
        <a-modal
            :title="modalTitle"
            :visible="modalVisible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
            >
            <Form ref="form">
                <!-- 标题 -->
                <m-input id="title" icon="tag" placeholder="title" mStyle="margin-bottom: 10px;" inputStyle="width: 300px;"></m-input>
                <!-- 描述 -->
                <m-input id="content" icon="file-text" placeholder="content" mStyle="margin-bottom: 10px;" inputStyle="width: 300px;"></m-input>
                <!-- 完成时间 -->
                <a-date-picker showTime v-model="date" style="width: 300px;"></a-date-picker>
            </Form>
        </a-modal>
    </div>
</template>
<script>
import {List, Avatar, Dropdown, Menu, Input, Icon, Modal, DatePicker, message} from "ant-design-vue";
import Form from "../../components/form";
import MInput from "../../components/form/input";
import {sleep} from "../../util";
import moment from "moment";
import Vue from "vue";
Vue.use(List);
Vue.use(Avatar);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Modal);
Vue.use(DatePicker);
export default {
    data() {
        return {
            loading: true,
            loadingMore: false,
            showLoadingMore: false,
            userName: "",
            filterBtn: [
                {
                    type: "activated",
                },
                {
                    type: "completed",
                },
                {
                    type: "self",
                },
            ],
            //处于激活状态的filter按钮
            filterBtnIndex: 0,
            //是否显示模态框
            modalVisible: false,
            //模态框确定按钮的加载状态
            confirmLoading: false,
            //todo-item要完成的时间点
            date: null,
            //正在编辑的todo-item的ID
            editId: null,
            modalTitle: ""
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        },
        todoList() {
            return this.$store.getters.todoListTrans;
            // return this.$store.state.todoList;
        }
    },
    methods: {
        clickSelfBtn(tragetId) {
            //用户角色类型：1普通用户，6超级管理员
            //超级管理员拥有权限
            if (this.userInfo.role === 6) {
                return true;
            }
            if (tragetId !== this.userInfo.id) {
                message.warn("你个基佬，点你妹啊！", 2);
                return false;
            }
            return true;
        },
        //请求todoList
        async getData(params = {}) {
            await this.$store.dispatch("todoList", params);
            this.loading = false;
        },
        onLoadMore () {
            this.getData();
        },
        //完成
        async complete(item) {
            if (!this.clickSelfBtn(item.userId)) return;
            await this.$store.dispatch("todo", {
                id: item.id,
                state: 2
            });
            //根据选中的筛选条件，重新请求列表数据
            let params = this.handleFilterParams(this.filterBtn[this.filterBtnIndex].type);
            this.getData(params);
        },
        emitEmpty () {
            this.$refs.userNameInput.focus();
            this.userName = "";
        },
        stop(event) {
            event.preventDefault();
        },
        handleFilterParams(type) {
            //根据选择的筛选条件，生成不同的参数
            let params = {};
            if (type === "completed") {
                params.state = 2;
            } else if (type === "activated") {
                params.state = 1;
            } else if (type === "self") {
                params.userId = this.userInfo.id;
            }
            return params;
        },
        //切换筛选条件
        filter(index, item) {
            this.filterBtnIndex = index;
            let params = this.handleFilterParams(item.type);
            this.getData(params);
        },
        //增加或修改一条todo-item
        async handleOk() {
            //将确定按钮置为加载中的状态
            this.confirmLoading = true;
            let {title, content} = this.$refs.form.getValues();
            let time = this.date.toDate().getTime();
            if (this.editId) {
                //编辑
                await this.$store.dispatch("todo", {
                    title,
                    content,
                    endDate: time,
                    id: this.editId
                });
            } else {
                //新增
                await this.$store.dispatch("todo", {
                    userId: this.userInfo.id,
                    title,
                    content,
                    createDate: Date.now(),
                    endDate: time,
                });
            }

            //结束加载状态
            this.confirmLoading = false;
            this.modalVisible = false;

            //根据选中的筛选条件，重新请求列表数据
            let params = this.handleFilterParams(this.filterBtn[this.filterBtnIndex].type);
            this.getData(params);
            
        },
        handleCancel() {
            this.modalVisible = false;
        },
        //显示模态框
        async add(item) {
            if (item.userId && !this.clickSelfBtn(item.userId)) return;
            this.modalVisible = true;
            await sleep(20);
            //编辑模式
            if (item && item.id) {
                this.editId = item.id;
                this.modalTitle = "edit";
                this.date = moment(new Date(item.endDate));
                this.$refs.form.setValues({
                    title: item.title,
                    content: item.content
                });
            } else {
                this.editId = "";
                this.modalTitle = "add a new todo item";
                this.$refs.form.resetValues();
                this.date = null;
            }
        },
        async deleteItem(item) {
            if (!this.clickSelfBtn(item.userId)) return;
            await this.$store.dispatch("todo", {
                id: item.id,
                state: 0
            });
            //根据选中的筛选条件，重新请求列表数据
            let params = this.handleFilterParams(this.filterBtn[this.filterBtnIndex].type);
            this.getData(params);
        }
    },
    mounted() {
        this.getData({state: 1});
        
    },
    components: {
        // List
        Form,
        MInput
    }
}
</script>
<style lang="scss" scoped>
.list-box {
    // width: 70%;
    display: flex;
    flex-flow: column nowrap;
    padding: 30px 15%;

    .header {
        display: flex;
        justify-content: space-between;
        
        .filter-box {
            span {
                // color: #1890ff;
                cursor: pointer;
                transition: color 0.3s;
                margin-right: 20px;
            }
        }

        .handle-box {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 10px;

            .add {
                color: #1890ff;
                cursor: pointer;
                transition: color 0.3s;
                margin-right: 20px;
            }
            input {
                border-radius: 20px;
            }
        }
    }
    
    .photo {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        min-width: 60px;

        .nickname {
            font-size: 12px;
            margin-top: 5px;
        }
    }

}
.ant-list {
    width: 100%;
}
.line {
    height: 1px;
    width: 100%;
    background: #e8e8e8;
}



</style>


