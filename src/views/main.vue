<template>
  <div class="home">
    <!--布局-->
    <el-container>
<!--      侧边-->
      <el-aside width="200px">
<!--        logo-->
        <div class="logo">
          <svg viewBox="0 0 500 500" version="1.1" id="svg_null"><defs><linearGradient x1="100%" y1="21.872%" x2="0%" y2="83.451%" id="linearGradient-1"><stop stop-color="#3F3F40" offset="0%"></stop><stop stop-color="#3C3C3D" offset="42.036%"></stop><stop stop-color="#39383A" offset="100%"></stop></linearGradient></defs><g id="root" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect id="background" fill="#FFF" x="0" y="0" width="500" height="500"></rect><g id="Group" transform="translate(40.000000, 340.000000)"><rect id="Rectangle-15" x="0" y="0" width="420" height="60"></rect><text id="headerText.accent" font-family="Inconsolata" font-size="56" font-style="normal" font-weight="700" line-spacing="56" letter-spacing="7" fill="#f95959" data-text-alignment="C"><tspan x="96.5" y="47.5">LETMD</tspan></text></g><polygon id="shape.accent" fill="#f95959" points="153.573 171.176 153.127 203.468 249.467 147.481 249.909 115.194"></polygon><polygon id="shape.accent" fill="#f95959" points="153.573 225.734 153.127 258.026 249.467 202.042 249.909 169.75"></polygon><polygon id="shape.accent" fill="#f95959" points="250.535 281.722 250.104 314.008 346.431 258.026 346.873 225.734"></polygon><polygon id="shape.accent" fill="#f95959" points="250.535 227.16 250.104 259.454 346.431 203.468 346.873 171.176"></polygon><polygon id="shape.accent" fill-opacity=".7" fill="#f95959" points="153.127 203.468 250.104 259.454 250.535 227.16 153.573 171.176"></polygon><polygon id="shape.accent" fill-opacity=".7" fill="#f95959" points="249.467 147.481 346.431 203.468 346.873 171.176 249.909 115.194"></polygon><polygon id="shape.accent" fill-opacity=".7" fill="#f95959" points="249.467 202.042 346.431 258.026 346.873 225.734 249.909 169.75"></polygon><polygon id="shape.accent" fill-opacity=".7" fill="#f95959" points="153.127 258.026 250.104 314.008 250.535 281.722 153.573 225.734"></polygon></g></svg>
        </div>
<!--        菜单-->
        <Menu></Menu>
      </el-aside>
<!--      内容-->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Menu from "@/components/Menu/index.vue";
export default {
  name: "Home",
  components: {
    Menu
  },
}
</script>

<style scoped lang="scss">
.home{
  height: 100%;
  ::v-deep{
    .el-container {
      height: 100%;
      .el-main{
        >div{
          background: #232323;
          height: 100%;
        }
        .content{
          height: calc(100% - 50px);
          padding-top: 20px;
          padding-left: 20px;
        }
      }
    }
  }
}

</style>