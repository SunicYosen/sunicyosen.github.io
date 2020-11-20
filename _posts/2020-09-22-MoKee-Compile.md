---
layout: post
title: MoKee Usage
date: 2020-09-22
category: Skills
author: Sun
tags: [Android]
summary:
---

MoKee编译指南

## 环境配置

本次编译使用Ubuntu20.04 LTS.

```bash
pip3 install lunch --user
sudo apt install imagemagick
```

## MoKee 源码同步

Git install `repo`

```bash
mkdir mokee & cd mokee
git clone git@github.com:MoKee/git-repo.git mokee-repo
```

同步Mokee源码

```bash
mkdir mokee-q & cd mokee-q
../mokee-repo/repo init -u https://github.com/MoKee/android -b mkp --depth 1 --platform=auto
export MK_AOSP_REMOTE=tuna
../mokee-repo/repo sync
```

这里的环境变量MK_AOSP_REMOTE指定了清华的镜像源。其他选项如下：

```bash
export MK_AOSP_REMOTE=caf (高通镜像)
export MK_AOSP_REMOTE=ustc (中国科学技术大学镜像)
export MK_AOSP_REMOTE=tuna (清华大学镜像)
export MK_AOSP_REMOTE=aosp (Google镜像)
```

## Compile

进入源码目录执行：

```bash
. build/envsetup.sh
lunch mk_cancro-userdebug
mka bacon
```
小米4的设备名称都是cancro

## OTA增量编译

声明生成OTA包的位置：

```bash
export MK_OTA_TARGET_PATH=~/Templates/MoKee/ota/target
export MK_OTA_INPUT=~/Templates/MoKee/ota/target
export MK_OTA_EXTRA=~/Templates/MoKee/ota/patch
```
生成增量包：

```bash
ota_all UNOFFICIAL dumpling
```

## Problems

### 1. Can not locate config makefile for product "mk_cancro"



### 2. lunch 时可能报错：

```
destroy_build_var_cache:unset:5: var_cache_ 2ND_TARGET_GCC_VERSION ANDROID_BUILD_PATHS BUILD_OS LLVM_PREBUILTS_VERSION TARGET_ARCH TARGET_BUILD_VARIANT TARGET_DEVICE TARGET_GCC_VERSION TARGET_PLATFORM_VERSION TARGET_PRODUCT print report_config : invalid parameter name
```

解决方法：

```bash
setopt shwordsplit
```

去除所有本地化的设置，让命令能正确执行

```bash
export LC_ALL=C
```

## Reference

<span id="rf1"></span> [[1]](#rrf1)  