<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
html, body {
  height: 100%;
  width: 100%;
}
.list-box .ant-list-item-action {
    display: flex;
    align-items: center;
}
.list-box .ant-list-item-meta-title {
    margin-bottom: 10px;
}
</style>
