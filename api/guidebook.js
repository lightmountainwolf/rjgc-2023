import request from '@/utils/request'


export default{
  getGuidebookList(searchModel){
    return request({
      url: '/guidebook/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        guidebookId: searchModel.guidebookId,
        guidebookName: searchModel.guidebookName
        
      }
    });
  },
  addGuidebook(guidebook){
    return request({
      url: '/guidebook',
      method: 'post',
      data: guidebook
    });
  },
  updateGuidebook(guidebook){
    return request({
      //url: '/guidebook' + id,
      url: '/guidebook',
      method: 'put',
      data: guidebook     
    });
  },
  saveGuidebook(guidebook,add){
    //alert(guidebook.guidebookId+guidebook.password);
    if(add=='1'){
      return this.addGuidebook(guidebook);
    }
    return this.updateGuidebook(guidebook);
  },
  getGuidebookById(guidebookId){
    return request({
      // url: '/guidebook' + id,
      url: `/guidebook/${guidebookId}`,
      method: 'get'
      
    });
  },
  deleteGuidebookById(guidebookId){
    return request({
      // url: '/guidebook' + id,
      url: `/guidebook/${guidebookId}`,
      method: 'delete'
      
    });
  }
}

