<!-- 房东注册成功 -->
<template>
    <div class="land">
        <img src="../assets/successs@2x.png" alt="">
        <h1>注册成功</h1>
        <p>点击确定返回</p>
        <button @click="back">确定</button>
    </div>
</template>

<script>
export default {
    data () {
       return {
       };
    },

    components: {},


    mounted() {},

    methods: {
        back(){
            this.$router.push('/personal')
        }
    }
}

</script>
<style lang='less' scoped>
@width75:75rem;
.land{
    padding: 101/@width75 38/@width75 0;
    text-align: center;
    img{
        width: 200/@width75;
    }
    h1{
        font-size: 40/@width75;
        margin: 44/@width75 0 20/@width75;
    }
    p{
        font-size: 28/@width75;
        color: rgb(153, 153, 153)
    }
    button{
        width: 100%;
        height: 88/@width75;
        background:rgb(53, 186, 182);
        color: white;
        margin-top: 64/@width75;
        line-height: 88/@width75;
        font-size: 36/@width75;
        border-radius: 44/@width75;
    }
}
</style>
