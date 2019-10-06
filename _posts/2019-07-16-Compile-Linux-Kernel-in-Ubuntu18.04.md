---
layout: post
title: Compile Linux Kernel in Ubuntu18.04
date: 2019-07-16 11:12
category: Skills
author: Sunic
tags: [Compile, "Linux Kernel", Install, Uninstall, Strip]
summary: The post record the experience of Compiling Linux kernel in Ubuntu18.04.
---

为了尝试Linux最新的Kernel版本，在Ubuntu18.04.2系统上编译了5.2.1版本的Kernel系统。记录了Kernel编译安装卸载等的过程。

## 1. 准备 PRE

1. 在Kernel的官方网站下载最新的Kernel. [Kernel Download](https://www.kernel.org/).

2. 安装依赖。

  ```bash
   sudo apt-get install build-essential
   sudo apt-get install libelf-dev
   sudo apt-get install libncurses-dev
   sudo apt-get install flex
   sudo apt-get install bison
  ```

## 2. 编译

### 2.1 Config

首先将原有的Kernel的config复制到Kernel的源码根目录。

```bash
 cd /path/to/source/code/
 cp /boot/config-xxx ./
```

应用现存配置文件：

```bash
 sudo make oldconfig
```

仅安装已有module：

```bash
 sudo make localmodconfig
```

使用图像界面对其余选项作配置。输入：

```bash
 cd /path/to/source/code/
 make menuconfig
```

跳出如下界面：

![Linux Kernel Config](/img/2019-07-16-Compile-Linux-Kernel-in-Ubuntu18.04/linux_kernel_config.png "Linux Kernel Config"){: .center-image .eighty-percent-image}

<span id="rrf1"></span>

可通过选项修改配置。比如，如果Kernel支持NTFS，则需要配置如下: [[1]](#rf1)

> File systems  --->
>> DOS/FAT/NT Filesystems  --->
>>> <\*> NTFS file system support  
>>> <\*> NTFS write support

同时需要FUSE支持，这里需要用到NTFS-3G的支持。
FUSE support (NTFS-3G)
The following kernel options must be enabled for NTFS read/write capabilities over FUSE in Linux:

KERNEL Enabling NTFS over FUSE using NTFS-3G

> File systems  --->
>> <*> FUSE (Filesystem in Userspace) support

The sys-fs/ntfs3g package is also required (see the emerge section below).

### 2.2 make编译

Config完成后，使用`make`命令完成编译。

```bash
 make
```

可以单独编译Modules:

```bash
 make modules
```

## 3. 安装 Install

```bash
sudo make install
```

可单独安装Modules

```bash
sudo make modules_install
```

### 3.1 Strip

默认情况下，模块安装有调试标识，导致其模块软件的体积很大。在安装和编译过程中可以使用INSTALL_MOD_STRIP的make变量，通过指定INSTALL_MOD_STRIP=1来使得编译安装的模块不包含调试标识，缩小体积<span id="rrf2"></span>[[2]](#rf2)。

```bash
make INSTALL_MOD_STRIP=1 modules
```

```bash
sudo make INSTALL_MOD_STRIP=1 modules_install
```

## 4. 卸载 Uninstall

直接通过删除的方式卸载：

```bash
sudo rm -rf /lib/modules/xxx
sudo rm -rf /usr/src/linux-headers-xxx
sudo rm /boot/*xxx*
sudo rm /var/lib/dpkg/info/linux-xxx
```

其中`xxx`一般为版本号。

删除完成后，使用`sudo update-grub`更新Grub菜单。

```bash
sudo update-grub
```

## Reference

<span id="rf1"></span>

[[1]](#rrf1): NTFS, [OL], 2019-07-16, [https://wiki.gentoo.org/wiki/NTFS](https://wiki.gentoo.org/wiki/NTFS)

<span id="rf2"></span>[[2]](#rrf2): Why is INSTALL_MOD_STRIP not on by default?, [OL], 2019-07-16, [https://superuser.com/questions/705121/why-is-install-mod-strip-not-on-by-default](https://superuser.com/questions/705121/why-is-install-mod-strip-not-on-by-default)
