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

## 软件安装

安装的主要软件包括`openssh-server`, `nginx`, `vim`，`zsh`，
`lsof`等，通过`opkg install xxx`实现。

- wpa-supplicant: 连接校园网wifi

- hostapd: 开启热点

## 配置

### 1. ssh配置<span id="rrf1"></span> [[1]](#rf1)

- Edit `/etc/ssh/sshd_config` and change `#PermitRootLogin
without-password` to `PermitRootLogin yes`

- Enable and start OpenSSH server. OpenSSH will listen now
  on port 22.

  ```bash
  /etc/init.d/sshd enable
  /etc/init.d/sshd start
  ```

### 2. 连接校园网

用以通过无线连接校园网做外网出口。

**连接**

- Network -> Wireless -> radio1(5G)/radio0(2.4G) -> Scan连
  接：
  
  | 配置 | 参数 |
  | :-: | :-: |
  | General Setup -> Mode | Client |
  | General Setup -> ESSID | Wifi名称(SJTU) | 
  | General Setup -> BSSID | 校园网MAC地址，可以绑定特定的wifi MAC |
  | General Setup -> Network | 网络 Interface接口，下面`IPv4`和`IPv6`两个 |
  | Security -> Encryption | WPA2-EAP |
  | Security -> EAP Method | PEAP |
  | Security -> Authentication | EAP-MSCHAPv2 |
  | Security -> Identity | `用户名` |
  | Security -> Password | `密码` |

**IPv4**

- 新建 Network -> Interface (Name: SJTU)

  - General -> Protocol: DHCP client
  - General -> Device: unspecified
  - General -> Bring up on boot: selected
  - Firewall Settings -> Create / Assign firewall-zone:
    SJTU/SJTU6


**IPv6**

- 新建 Network -> Interface (Name: SJTU6)

  - General -> Protocol: DHCP6 client
  - General -> Device: wlan1
  - General -> Bring up on boot: selected
  - Firewall Settings -> Create / Assign firewall-zone:
    SJTU/SJTU6

- IPv6 NAT66

  - Network -> Interface -> LAN edit -> DHCP server 配置如下：

    | 配置 | 参数 |
    | :-: | :-: |
    | RA - Service | server mode |
    | DHCPv6-Service | server mode |
    | **Local IPv6 DNS Server** | `unchecked` |
    | NDP-Proxy | disabled |

  - NAT66配置 <span id="rrf2"></span> [[2]](#rf2)

    - 打开 IPv6, iptables添加IPv6的NAT表。在
      `/etc/firewall.user`里面加上：

       ```bash
       WAN6=SJTU
       LAN=br-lan
       ip6tables -t nat -A POSTROUTING -o $WAN6 -j MASQUERADE
       ip6tables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
       ip6tables -A FORWARD -i $LAN -j ACCEPT
       ```

       ***WAN6和LAN分别改成外网IPv6和内网网卡(interface)的名字，注意不是防火墙区域(zone)的名字，也不是LuCI里面Network->Interfaces里面看到的名字，而是ifconfig看到的名字***
    
    - 正确配置网关

      添加`/etc/hotplug.d/iface/99-ipv6`文件：

      ```bash
        #!/bin/sh
        [ "$ACTION" = ifup ] || exit 0
        iface=SJTU6
        [ -z "$iface" -o "$INTERFACE" = "$iface" ] || exit 0
        ip -6 route add `ip -6 route show default|sed -e 's/from [^ ]* //'`
        logger -t IPv6 "Add IPv6 default route."
      ```

      ***这里iface是LuCI里面Network->Interfaces里面看到的名
      字，一般叫wan6。这个脚本的意思是在wan6起来以后读取默认
      网关，把带from的内容去掉，再加到系统路由表里。同时***
      
      ```bash
      chmod +x /etc/hotplug.d/iface/99-ipv6
      ```
- 静态 IP

- 开启热点

  - 安装`hostapd`软件
  
  - Network -> Wireless  -> radio0(2.4G)/radio1(5G) -> Add添
    加：

      | 配置 | 参数 |
      | :-: | :-: |
      | General Setup -> Mode | Access Point |
      | General Setup -> ESSID | Wifi名称(sunnet) | 
      | General Setup ->Network | lan |
      | Security -> Encryption | WPA2-PSK |
      | Security -> Key | `密码` |

### 3. WAN口转LAN口

- 修改Network -> Interface -> Devices
  - `br-lan` : Bridge ports 添加 `wan`

### 4. 挂载U盘

  安装下述packages即可。

  ```bash
  opkg install block-mount e2fsprogs kmod-fs-ext4 kmod-usb-storage kmod-usb2 kmod-usb3
  ```

### 5. zsh

- 安装`zsh`

- 修改`/etc/passwd` 中 `root:`开头行中`/bin/ash`为
  `/usr/bin/zsh`

- `.oh-my-zsh`文件夹复制到`/root/`

- `cd root  &&` `ln -s .oh-my-zsh/sunic-zsh/zshrc.sh .zshrc`

### 6. vim

- 复制`.vimrc`到`/root/`

### 7. nginx

- 安装`nginx`

- 复制证书和配置文件


## Problems

- Nginx代理luci时报错：`No related RPC reply`
  - Status: `待解决`

## Reference

<span id="rf1"></span> [[1]](#rrf1) [Replacing Dropbear by
openssh-server](https://oldwiki.archive.openwrt.org/inbox/replacingdropbearbyopensshserver)

<span id="rf2"></span> [[2]](#rrf2) [OpenWRT 路由器作为 IPv6 网关的配置](https://github.com/tuna/ipv6.tsinghua.edu.cn/blob/master/openwrt.md)

