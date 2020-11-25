import request from '../utils/request';

export const fetchData = (url) => {
    return request({
        url: url,
        method: 'get',
        // params: query
    });
};
