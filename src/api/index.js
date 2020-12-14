import request from '../utils/request';

export const fetchData = (url) => {
    return request({
        url: url,
        method: 'get',
        // params: query
    });
};
export const addData = (url,body) => {
    return request({
        method: 'post',
        url:url,
        data:body,
    })
};
