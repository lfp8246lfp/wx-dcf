<template>
  <li class="weui-uploader__file" >
    <img :src="backgroundImage" alt="">
  </li>
</template>

<script>
export default {
  props: {
    backgroundImage: {
      type: String,
      default: ''
    }
  },

  mounted(){
    this.backgroundImage="hhtp://"+this.backgroundImage
  }
}
</script>
