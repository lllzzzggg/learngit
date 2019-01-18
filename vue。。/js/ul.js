// var vm = new Vue({
//     el:"#vm",
//     data:{
//         // items: [
//         //     { id:'1',message: 'Foo' },
//         //     { id:'2',message: 'Bar' }
//         // ]
//         // object:{
//         //     firstName:'John',
//         //     lastName:'Doe',
//         //     age:'20'
//         // }
//         // userProfile:{
//         //     name:'Godness'
//         // }
//         number:[1, 2, 3, 4, 5 ]
//     },
//     computed:{
//         evenNumber:function(){
//             return this.number.filter(function(number){
//                 return number % 2 === 0;
//             })
//         }
//     }
// })
// // Vue.set(vm.userProfile, 'math', 30);        //可以添加一个新的 age 属性到嵌套的 userProfile 对象：
// // vm.$set(vm.userProfile, 'age', 27);         //还可以使用 vm.$set 实例方法，它只是全局 Vue.set 的别名
// vm.userProfile = Object.assign({}, vm.userProfile, {
//     age: 27,
//     favoriteColor: 'Vue Green'
// })                  //有时你可能需要为已有对象赋予多个新属性，比如使用 Object.assign() 或 _.extend()。在这种情况下，你应该用两个对象的属性创建一个新的对象。
Vue.component('todo-item',{
    template:'\
    <li>\
    {{ title }}\
    <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
    ',
    props:['title']
})
new Vue({
    el:'#vm',
    data:{
        newTodoText:'',
        todos:[
            {
                id:1,
                title:'Do the dises',
            },
            {
              id: 2,
              title: 'Take out the trash',
            },
            {
              id: 3,
              title: 'Mow the lawn'
            }
        ],
        nextTodoId:4
    },
    methods:{
        addNewTodo:function(){
            this.todos.push({
                id:this.nextTodoId++,
                title:this.newTodoText
            })
            this.newTodoText = ''
        }
    }
})