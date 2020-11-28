---
layout: post
title: Iptables Usage
date: 2020-11-20
category: Skills
author: Sun
tags: [Linux]
summary:
---

由于用到了iptable用作端口转发，作此记录。

## iptables简介

> Program that allows configuration of tables, chains and rules provided by the Linux kernel firewall.

- View chains, rules, and packet/byte counters for all tables:`sudo iptables -vnL`

- Set chain policy rule: `sudo iptables -P {{chain}} {{rule}}`

- Append rule to chain policy for IP:`sudo iptables -A {{chain}} -s {{ip}} -j {{rule}}`

- Append rule to chain policy for IP considering protocol and port: `sudo iptables -A {{chain}} -s {{ip}} -p {{protocol}} --dport {{port}} -j {{rule}}`

- Delete chain rule:`sudo iptables -D {{chain}} {{rule_line_number}}`

- Save iptables configuration of a given table to a file: `sudo iptables-save -t {{tablename}} > {{path/to/iptables_file}}`

- Restore iptables configuration from a file: `sudo iptables-restore < {{path/to/iptables_file}}`

## 端口转发
首先开启端口转发：<span id="rrf1"></span> [[1]](#rf1)

`vim /etc/sysctl.conf`中修改或添加:

`net.ipv4.ip_forward = 1`

### ssh端口转发

> 主要用于外网机器端口映射到内网的`22`端口，实现内网机器ssh远程登录。这里`2222`端口映射到内网`10.42.0.155`的`22`端口。

\# 修改转发数据来源为内网网卡IP

- `iptables -t nat -A PREROUTING -p tcp -m tcp --dport 2222 -j DNAT --to-destination 10.42.0.155:22`

\# 设置接受对`2222`端口的访问

- `iptables -t filter -A INPUT -p tcp -m state --state NEW -m tcp --dport 2222 -j ACCEPT` 

\# 设置转发出接口为enp2s0
- `iptables -t nat -A POSTROUTING -o enp2s0 -j MASQUERADE`

### samba端口转发

> 主要用于外网机器端口映射到内网的`445`端口(Samba共享端口)，实现内网机器ssh远程登录。这里`4455`端口映射到内网`10.42.0.155`的`445`端口。

\# 修改转发数据来源为内网网卡IP

- `iptables -t nat -A PREROUTING -p tcp -m tcp --dport 4455 -j DNAT --to-destination 10.42.0.155:445`

\# 设置接受对`4455`端口的访问

- `iptables -t filter -A INPUT -p tcp -m state --state NEW -m tcp --dport 4455 -j ACCEPT` 

\# 设置转发出接口为enp2s0，与ssh只需要执行一次。
- `iptables -t nat -A POSTROUTING -o enp2s0 -j MASQUERADE`

### VNC端口转发

> 主要用于外网机器端口映射到内网的`5901`端口(Samba共享端口)，实现内网机器ssh远程登录。这里`5911`端口映射到内网`10.42.0.155`的`5901`端口。

\# 修改转发数据来源为内网网卡IP

- `iptables -t nat -A PREROUTING -p tcp -m tcp --dport 5911 -j DNAT --to-destination 10.42.0.155:5901`

\# 设置接受对`5911`端口的访问

- `iptables -t filter -A INPUT -p tcp -m state --state NEW -m tcp --dport 5911 -j ACCEPT` 

\# 设置转发出接口为enp2s0，与ssh/Samba只需要执行一次。
- `iptables -t nat -A POSTROUTING -o enp2s0 -j MASQUERADE`

## 网络变化restore转发

- 首先保存：
```bash
sudo bash -c "iptables-save > /etc/iptables.rules"
sudo bash -c "iptables-save > /etc/iptables/rules.v4"
```

- 网络变化restore：
```bash
vim /etc/network/if-up.d/iptables
```

iptables内容：
```bash
#!/bin/sh

/sbin/iptables-restore < /etc/iptables.rules
```

## Problems

1. 由于设置了有线网口的网络共享，在`iptable`中会添加两条阻止内网转发的规则。如下：

```
-A FORWARD -o enp2s0 -j REJECT --reject-with icmp-port-unreachable
-A FORWARD -i enp2s0 -j REJECT --reject-with icmp-port-unreachable
```

需要注释掉。

## Reference

<span id="rf1"></span> [[1]](#rrf1)   iptables设置映射通过外网端口代理ssh登录内网服务器, [https://blog.csdn.net/qq_39626154/article/details/82380581](https://blog.csdn.net/qq_39626154/article/details/82380581)