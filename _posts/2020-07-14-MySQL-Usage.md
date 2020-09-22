---
layout: post
title: MySQL Usage
date: 2020-07-14
category: Skills
author: Sun
tags: [MySQL]
summary: 
---

总结近期对MySQL的学习

## 创建用户

- 创建新用户

```mysql
create user 'username'@'host' identified by 'password'; 
```

其中username为自定义的用户名；host为登录域名，host为'%'时表示为任意IP，为localhost时表示本机，或者填写指定的IP地址；paasword为密码;

- 为用户授权
```mysql
grant all privileges on . to 'username'@'%' with grant option; 
```

其中*.第一个表示所有数据库，第二个表示所有数据表，如果不想授权全部那就把对应的写成相应数据库或者数据表；username为指定的用户；%为该用户登录的域名
授权之后刷新权限：flush privileges;

## Reference

<span id="rf1"></span> [[1]](#rrf1) 