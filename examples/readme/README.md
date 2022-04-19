**项目启动命令**
```
本地环境启动命令：yarn run dev
测试环境打包命令：yarn run build:test
正式环境打包命令：yarn run build
```
**项目说明**
```
项目使用Vue3 + vite 开发，UI框架采用Element-Plus。
当你接手下面呢的说明可能对你有用：
1、项目相关路由如下：
/overview               --- 服务概览
/release                --- 服务发布
/comp                   --- 组件管理
    /comp-list          --- 组件列表
    /app-list           --- 应用列表
    /call-list          --- 调用统计
/approve                --- 服务审批
    /dept-approve       --- 部门审批
    /data-approve       --- 数据局审批
```

**项目结构**
```
lin-ping-assembly-admin
├─api 项目所有的接口
│ 
├─assets 静态资源
│  ├─font         字体资源
│  ├─img          图片资源
│  └─scss         样式文件
│  
├─components           共用的组件（放置全局组件，对应的页面级组件放置到对应的模块下的comp文件下）
│  ├─base-pagination   基础分页组件
│  ├─base-upload       基础上传组件
│  ├─second-title      二级标题组件
│  └─icon-svg          svg组件
│ 
├─icons     项目用到的svg
│  
├──router   页面路由
│
├──store    数据状态管理
│  
├──utils 
│  ├─http         对axios的封装工具
│  ├─index        共用方法集
│  ├─svg-builder  vite插件加载svg文件
│  ├─validate     相关校验方法
│  └─config       相关跳转地址
│ 
├──views 
│  ├─common   共用模块
│  ├─layout   整体布局模块
│  └─modules  视图页面
│    ├─approve      审批管理
│    ├─comp         组件管理
│    ├─index        服务概览
│    └─release      发布中心
```
<br> 

**项目相关环境**
```
本地环境代理

测试环境代理

线上环境代理
```

**代码提交规范**
```
集成了husky + commitlint
git add .
cz
```

