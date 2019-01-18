var vm = new Vue({
    el:'#vm',
    data:{
        selected:'A',
        options:[
            { text: 'One' ,value: 'A' },
            { text: 'Two' ,value: 'B' },
            { text: 'Three' ,value: 'C' }
        ],
        isA:true
    },
    computed:{
        classObject: function () {
            return {
                iconWarnImg: this.isActive && !this.error,
            }
          }
    },
    methods:{
        greet:function(event){
            alert('Hello ' + this.name + '!');
            if(event){
                alert(event.target.tagName)
            }
        },
        toggle:function(){
            this.isA = !this.isA;
        }
    }
});