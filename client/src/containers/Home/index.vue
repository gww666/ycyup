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
                <span class="add">add</span>
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
            :dataSource="data">
            <div v-if="showLoadingMore" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                <a-spin v-if="loadingMore" />
                <a-button v-else @click="onLoadMore">loading more</a-button>
            </div>
            <a-list-item slot="renderItem" slot-scope="item">
                <a slot="actions" @click="complete">complete</a>
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
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                >
                    <a slot="title" href="https://vue.ant.design/">{{item.title}}</a>
                    <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </a-list-item-meta>
                <div>
                    <span>2018-09-10 / 2019-10-09</span>
                </div>
            </a-list-item>
        </a-list>
    </div>
</template>
<script>
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
]
import {List, Avatar, Dropdown, Menu, Input, Icon} from "ant-design-vue";
import Vue from "vue";
Vue.use(List);
Vue.use(Avatar);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Input);
Vue.use(Icon);
export default {
    data() {
        return {
            loading: true,
            loadingMore: false,
            showLoadingMore: true,
            data,
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
            filterBtnIndex: 0
        }
    },
    methods: {
        getData(callback) {
            setTimeout(() => {
                this.loading = false;
            }, 500);
        },
        onLoadMore () {
            this.getData();
        },
        //完成
        complete() {
            
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
        }

    },
    mounted() {
        this.getData();
    },
    components: {
        // List
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
.ant-list-item-content {
    
}
</style>


