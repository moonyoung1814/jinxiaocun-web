import request from '../utils/request';

export const fetchData = (url, query = {}) => {
    return request({
        url: url,
        method: 'get',
        params: query
    });
};
export const addData = (url,body) => {
    return request({
        method: 'post',
        url:url,
        data:body,
    })
};

export const deleteData = url =>{
    return request({
        method: 'delete',
        url: url,
    })
}

export const updateData = (url, body) =>{
    return request({
        method: 'put',
        url:url,
        data:body
    })
}
