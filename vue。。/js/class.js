Vue.component('my-com',{
    template:'<p class = "com">hello</p>'
})
var vm = new Vue({
    el:"#vm",
    data:{
        isActive:true,
        error:null,
        styleObject:{
            color:'red',
            fontSize:'50px'
        }
    },
    computed:{
        classObject: function(){
            return {
                active:this.isActive && !this.error,
                'text-danger':this.error && this.error.type === 'fatal'
            }
        }
    }
})

{/* 
    .static{
            border: 1px solid #000;
            background-color: gray; 
            padding: 20px;
        }
        .active{
            color: aliceblue;
        }
        .text-danger{
            color: aqua;
        }
        .com{
            width: 100%;
            min-height: 33px;
            background-color: blue; 
        }
    
    <div id = "vm">
        <div class = "static" v-bind:class = "classObject">
            show
        </div>
        <my-com v-bind:class="{ active: isActive}">dadsa</my-com>
        <my-com v-bind:style="styleObject">com 2</my-com>
</div> */}