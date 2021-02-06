    /**
 *
 * @param {String} method 请求方式  需要大写
 * @param {String} url    请求地址  协议（http）+ 域名+ 端口号 + 路径
 * @param {String} data   请求数据  key=value&key1=value1
 * @param {Function} cb     成功的回调函数
 * @param {Boolean} isAsync 是否异步 true 是异步  false 代表同步
 */
    //封装的一个ajax的方法
function ajax(method, url, data, cb, isAsync) {
    console.log(data)
    // get   url + '?' + data
    // post
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    // xhr.readyState    1 - 4  监听是否有响应
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          cb(JSON.parse(xhr.responseText));
        }
      }
    };
    method = method.toUpperCase();
    if (method == "GET") {
      xhr.open(method, url + "?" + data, isAsync);
      xhr.send();
    } else if (method == "POST") {
      xhr.open(method, url, isAsync);
      // key=value&key1=valu1
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    }
  }
  
//封装的一个获取兄弟节点的方f法
function getSiblings(node) {
    var elements = [].slice.call(node.parentNode.children);  //把这个类数组变成一个数组
    return elements.filter(function (item) {
      return item != node;   //过滤这个数组排除自己本身
    });
  }
  var tableData = []
  var menu = document.getElementById('menu')
  menu.onclick = function(e){
      //页面切换行为
      if(e.target.tagName === 'DD'){  //如果这个触发事件源是dd标签   注意dd必须大写
          var actives = getSiblings(e.target)   //获取到增设个事件源的兄弟节点
          for(var i = 0;i < actives.length;i++){
              actives[i].classList.remove('active') //把除自己外的兄弟节点的样式删除
          }
          e.target.classList.add('active')  //给这个点击触发事件源的添加class属性
          
          var id = e.target.getAttribute('data-id')   //获取到这个data-id的属性值  datda-还有个自己的特殊方法就是dadaset.id
          var hide = document.getElementById(id)   //通过这个变量id获取到这个对应的div
          hide.classList.add('togglehide')  //给这个div添加black样式
          var hidenode = getSiblings(hide) //删除除了自己的所有兄弟节点的样式
          for(var i = 0;i < hidenode.length;i++){
              hidenode[i].classList.remove('togglehide')
          }

      }
  }

    //新增学生
 var submit = document.getElementById('sub')
     submit.onclick = function(e){
        e.preventDefault();  // 阻止submit的一个默认行为
        var form = document.getElementById('studentAdd');
        var formdata = getformdata(form)
        //请求数据
       
        if(formdata.status == 'fail'){
            alert(formdata.msg)
        } else{
          //把这个两个对象合并
            var data = Object.assign(
                {appkey:'_xiaopig_1606745110171'},
                formdata.data)
                console.log(data)
          //把对象的形式拼接成字符串
            var dataStr = '';
           for(var prop in data){
            if (data.hasOwnProperty(prop)) {
              dataStr += prop + '=' + data[prop] + '&';
            }
           }
            // aja发送请求
            ajax('get','http://open.duyiedu.com/api/student/addStudent',dataStr,function(sc){
                if(sc.status == 'success'){
                  alert('添加成功')
                  var studentlist = document.querySelector('#menu dd[data-id=list]')   //选取到学生列表
                  studentlist.click()   //自动触发这个点击事件
                }else{
                  alert(sc.msg)
                }
                
            },true)
        }


     }

    //  获取学生列表
     function lisStudent(){
        transferDate('/api/student/findAll','',function(data){
          tableData = data
          redertable(data)

        })
     }

    //封装网络请求的一个方法
     function transferDate(url,data,success){
      var dataStr = '';
       if(typeof data === 'object'){
          data = Object.assign(
         {appkey:'_xiaopig_1606745110171'},
         data)
        //  console.log(data)
         //把对象的形式拼接成字符串
         for(var prop in data){
         if (data.hasOwnProperty(prop)) {
          dataStr += prop + '=' + data[prop] + '&';
      }
     }
    }else{
      dataStr = data + '&appkey=_xiaopig_1606745110171'
    }
      ajax('get','http://open.duyiedu.com/' + url,dataStr,function(sc){
        //如果请求成功  这回调函数接收到这个后台返回的一个数据
        if(sc.status == 'success'){
            success(sc.data)
        }else{
          alert(sc.msg)
        }
    },true)
     }

     //渲染表格
     function redertable(data){
       var str = ''
       var dateyear = new Date().getFullYear()  //获取到当前的年份
       console.log(dateyear)
       data.forEach(function(item,index){
         str +=`
        <tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == 0? '男' : '女'}</td>
        <td>${item.email}</td>
        <td>${dateyear - item.birth}</td>    
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
          <button class="btn one" data-index = ${index}>编辑</button>
          <button class="btn two" data-index = ${index}>删除</button>
        </td>
      </tr>`
      var tbody = document.querySelector('.tbody')
      tbody.innerHTML = str
       },'')
     }
    

     //编辑表格中按钮的行为
     //编辑按钮
     var tbody = document.querySelector('.tbody')
     var modal = document.querySelector('.modal')
     console.log(tbody,modal)
     tbody.onclick = function(e){
        if(e.target.classList.contains('one')){
          modal.classList.add('show')
          var index = e.target.dataset.index
          console.log(index)
          renderEditForm(tableData[index])
        }

        //删除功能
        else if(e.target.classList.contains('two')){
          var index = e.target.dataset.index
          var student = tableData[index]
          var isDel = confirm('确认删除学号为' + student.sNo + '的信息吗?')  //这个一个是否确定的弹窗
          if(isDel){
            transferDate(
              '/api/student/delBySno',
             {sNo: student.sNo},
             function(){
               alert('删除成功')
               lisStudent()
             }
            )
          }
        }
     }

     



     //点击空白区域编辑框消失
     modal.onclick = function(e){
       if(e.target === this){
         modal.classList.remove('show')
       }
     }

     
     //编辑表格数据回填
     function renderEditForm(data){
       var form = document.getElementById('modal-studentAdd')
       console.log(form)
       for(var prop in data){
         if (form[prop]){
           form[prop].value = data[prop]
         }
       }
     }

     //编辑里面的提交
     var modalsub = document.getElementById('modal-sub')
     modalsub.onclick = function(e){
       e.preventDefault()
     var modalform = document.getElementById('modal-studentAdd')
    //  console.log(modalform)
      var modalformdata = getformdata(modalform)
      console.log(modalformdata.data)
      if(modalformdata.status == 'fail'){
        alert(modalformdata.msg)
      }else{
        transferDate('/api/student/updateStudent',modalformdata.data,function(){
          alert('修改成功')
          modal.classList.remove('show')
          lisStudent()
        })
      }
     }


//封装一个form数据的方法     获取到表单的数据
function getformdata(form){
    //获取表单的数据就是表单下面的name值一个value
    var name = form.name.value
    var sex = form.sex.value
    var email = form.email.value
    var sNo = form.sNo.value
    var birth = form.birth.value
    var phone = form.phone.value
    var address = form.address.value
    //检验数据
    if(!name||!sex||!email||!sNo||!birth||!phone||!address){
        return {
            status : 'fail',
            msg : '你是个憨憨吗?空的你提交个啥啊!!!'
        }
   }


      // 性别 为0或1
  var sexReg = /^[01]$/;
  if (!sexReg.test(sex)) {
    return {
      status: 'fail',
      msg: '性别只能选择男或女'
    }
  }
  // 邮箱  @ .com/.cn
  var emailReg = /^[\w\.]+@[\w-]+\.(com|cn)$/;
  if (!emailReg.test(email)) {
    return {
      status: 'fail',
      msg: '邮箱格式不正确'
    }
  }
  // 出生年份  年龄在 10 - 80之间  1940 - 2010
  if (birth < 1940 || birth > 2010) {
    return {
      status: 'fail',
      msg: '学生出生年份请填写1940 - 2010 之间的数字'
    }
  }
  // 手机号  11位数字  以1开头  第二位不是1/2
  var phoneReg = /^1[3-9]\d{9}$/;
  if (!phoneReg.test(phone)) {
    return {
      status: 'fail',
      msg: '手机号格式不正确'
    }
  }
  //学号  1-6位数字
  var RsNo = /^\d{4}|\d{6}$/;
  if(!RsNo.test(sNo)){
        return{
          status : 'fail',
          msg : '请输入4-6位的数字学号'
           }
         }
    

        return{
          status : 'suceess',
            data : {
                name,
                sex,
                email,
                sNo,
                birth,
                phone,
                address
            }
        }
      }
      lisStudent()