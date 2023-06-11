import request from '@/utils/request'


export default{
  getUserList(searchModel){
    return request({
      url: '/user/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        userName: searchModel.userName,
        phoneNumber: searchModel.phoneNumber
      }
    });
  },
  addUser(user){
    return request({
      url: '/user',
      method: 'post',
      data: user
    });
  },
  updateUser(user){
    return request({
      //url: '/user' + id,
      url: '/user',
      method: 'put',
      data: user     
    });
  },
  saveUser(user,add){
    //alert(user.userId+user.password);
    if(add=='1'){
      return this.addUser(user);
    }
    return this.updateUser(user);
  },
  getUserById(userId){
    return request({
      // url: '/user' + id,
      url: `/user/${userId}`,
      method: 'get'
      
    });
  },
  deleteUserById(userId){
    return request({
      // url: '/user' + id,
      url: `/user/${userId}`,
      method: 'delete'
      
    });
  }
}

