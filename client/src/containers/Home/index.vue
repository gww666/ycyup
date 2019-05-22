<template>
    <div class="list-box">
        <div class="header">
            <div class="filter-box">
                <span :style="[{color: index === filterBtnIndex ? '#1890ff' : '#666'}]"
                    @click="filter(index)"
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
            <div v-if="showLoadingMore" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                <a-spin v-if="loadingMore" />
                <a-button v-else @click="onLoadMore">loading more</a-button>
            </div>
            <a-list-item slot="renderItem" slot-scope="item">
                <a slot="actions" @click="complete(item)">complete</a>
                <a slot="actions">
                    <a-dropdown>
                        <a class="ant-dropdown-link" href="#">
                            more<a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item>
                                <a href="javascript:;">edit</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">delete</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </a>
                <a-list-item-meta
                    :description="item.content">
                    <a slot="title">{{item.title}}</a>
                    <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </a-list-item-meta>
                <div>
                    <span>{{item.createDate}} / {{item.endDate}}</span>
                </div>
            </a-list-item>
        </a-list>
        <a-modal
            title="add a new todo item"
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
import {List, Avatar, Dropdown, Menu, Input, Icon, Modal, DatePicker} from "ant-design-vue";
import Form from "../../components/form";
import MInput from "../../components/form/input";
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
            showLoadingMore: true,
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
            editId: null
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
        //请求todoList
        async getData(params = {}) {
            await this.$store.dispatch("todoList", params);
            this.loading = false;
        },
        onLoadMore () {
            this.getData();
        },
        //完成
        complete(item) {
            this.$store.dispatch("todo", {
                id: item.id,
                state: 2
            });
        },
        emitEmpty () {
            this.$refs.userNameInput.focus();
            this.userName = "";
        },
        stop(event) {
            event.preventDefault();
        },
        filter(index) {
            
            this.filterBtnIndex = index;
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

            //重新请求列表
            this.getData();
            
        },
        handleCancel() {
            this.modalVisible = false;
        },
        add() {
            //显示模态框
            this.modalVisible = true;
            let date = new Date().setDate(new Date().getDate() - 5);
            this.date = moment(date);
        },
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


