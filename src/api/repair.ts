import request from '@/utils/system/request'

// 获取数据api
export function getData(data: object) {
  return request({
    url: '/card/list',
    method: 'post',
    baseURL: '/mock',
    data
  })
}

export function queryData(data:object){
    return request({
        url: '/troubleInfo/query',
        method:'post',
        baseURL:'http://175.178.101.42:8099',
        data
    })  
}

export function addData(data:object){
    return request({
        url: '/troubleInfo/add',
        method:'post',
        baseURL:'http://175.178.101.42:8099',
        data
    })  
}

export function updateData(data:object){
    return request({
        url: '/troubleInfo/update',
        method:'post',
        baseURL:'http://175.178.101.42:8099',
        data
    })  
}

export function deleteData(data:object){
    return request({
        url: '/troubleInfo/delete',
        method:'post',
        baseURL:'http://175.178.101.42:8099',
        data
    })  
}

export function uploadImage(data:object){
    return request({
        url: '/troubleInfo/upload',
        method:'post',
        baseURL:'http://175.178.101.42:8099',
        data
    })  
}