const env = process.env.NODE_ENV;
const expiredays = 1000 * 60 * 60 * 24;
let conf = {
    sysId: 'manager',
    sysName: '测试项目后台管理',
    expiredays,
    basePath: '/biz'
};

let devConf = {
    basePath: '',
    baseUrl: 'http://localhost:10001'
};

let testConf = {baseUrl: 'http://server/service'};

let prodConf = {};

if (env == 'development') {
    Object.assign(conf, devConf);
} else if (env == 'test') {
    Object.assign(conf, testConf);
} else if (env == 'production') {
    Object.assign(conf, prodConf);
}

export default conf;