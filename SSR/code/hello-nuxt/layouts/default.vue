<template>
  <div class="layout">
    <div class="header">
      <div>Header</div>
      <div>
        <NuxtLink to="/">
          <button>home</button>
        </NuxtLink>
        <NuxtLink to="/detail01">
          <button>detail01</button>
        </NuxtLink>
        <NuxtLink href="/detail01/abc">
          <button>detail01/abc</button>
        </NuxtLink>
        <NuxtLink to="/detail02">
          <button>detail02</button>
        </NuxtLink>
        <NuxtLink href="/detail02/user-aaa">
          <button>detail02/abc</button>
        </NuxtLink>
        <NuxtLink to="/detail03-333">
          <button>detail03-333</button>
        </NuxtLink>
        <NuxtLink to="/detail04">
          <button>detail04</button>
        </NuxtLink>
        <NuxtLink to="/detail04/abc">
          <button>detail04/abc</button>
        </NuxtLink>
        <NuxtLink to="/login">
          <button>login</button>
        </NuxtLink>
        <br />
        <br />
      </div>
    </div>
    <slot></slot>
    <div class="footer">footer</div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.header {
  border: 1px solid red;
  text-align: center;
  font-size: 30px;
}
.footer {
  border: 1px solid green;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
}
</style>
