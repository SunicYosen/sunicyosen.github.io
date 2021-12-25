---
layout: post
title: Openwrt安装升级升级配置教程
date: 2021-12-25
category: Skills
author: Sun
tags: [Linux]
summary:
---

Openwrt安装后配置的过程。

## 软件升级

可以通过下面命令对软件升级

```bash 
opkg update
# Upgrade all package upgradable
opkg list-upgradable | awk -F ' - ' '{print $1}' | xargs opkg upgrade
```

