import request from '@/utils/request'


export default{
  getClassList(searchModel){
    return request({
      url: '/class/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        classId: searchModel.classId,
        className: searchModel.className
        
      }
    });
  },
  addClass(course){
    return request({
      url: '/class',
      method: 'post',
      data: course
    });
  },
  updateClass(course){
    return request({
      //url: '/class' + id,
      url: '/class',
      method: 'put',
      data: course     
    });
  },
  saveClass(course,add){
    //alert(course.courseId+course.password);
    if(add=='1'){
      return this.addClass(course);
    }
    return this.updateClass(course);
  },
  getClassById(classId){
    return request({
      // url: '/class' + id,
      url: `/class/${classId}`,
      method: 'get'
      
    });
  },
  deleteClassById(classId){
    return request({
      // url: '/user' + id,
      url: `/class/${classId}`,
      method: 'delete'
      
    });
  }
}
