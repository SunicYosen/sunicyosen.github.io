---
layout: post
title: 原生/国外Android WIFI limited connetion
date: 2022-06-25
category: Skills
author: Sun
tags: [Android]
summary:
---

国外android系统会导致联网但显示limited connection,主要是验证服务器的问题。

## 解决方案

使用 ADB 命令解决：

1. 删除默认的强制门户设置：
```bash
adb shell settings delete global captive_portal_https_url
adb shell settings delete global captive_portal_http_url
```
2. 修改新的设置：

```bash
adb shell settings put global captive_portal_https_url https://connect.rom.miui.com/generate_204
adb shell settings put global captive_portal_http_url http://connect.rom.miui.com/generate_204
```
3. 打开飞行模式，然后关闭飞行模式