---
layout: post
title: MIUI国内版精简
date: 2020-03-10 15:12
category: Skills
author: Sun
tags: [Miui11 Android boot cust]
summary: 
---

基于官方MIUI V11.0.2 for mido. `mido_images_V11.0.2.0.NCFCNXM_20191107.0000.00_7.0_cn`
精简。

## 1. Recovery

这里我们使用twrp的recovery

```bash
fastboot flash recovery twrp-3.3.1-0-mido.img
```

## 2. Boot

由于MIUI带有启动保护，会验证system分区的情况，所以需要通过修改boot分区的来取消verify.

需要的工具：split_bootimg.pl，mkbootimg，mkbootfs[1]

### 1. 拆包boot.img

需要用到一个perl脚本split_bootimg.pl。在linux终端里输入以下命令：

```bash
split_bootimg.pl boot.img
```

上述命令会报出boot.img的信息，如大致如下：

```
Page size: 2048 (0x00000800)
Kernel size: 24020863 (0x016e877f)
Ramdisk size: 2234010 (0x0022169a)
Second size: 0 (0x00000000)
Board name: 
Command line: ignore_loglevel console=ttyHSL0,115200,n8 androidboot.console=ttyHSL0 androidboot.hardware=qcom msm_rtb.filter=0x237 ehci-hcd.park=3 lpm_levels.sleep_disabled=1 androidboot.bootdevice=7824900.sdhci earlycon=msm_hsl_uart,0x78af000
Writing boot.img-kernel ... complete.
Writing boot.img-ramdisk.gz ... complete.
```

执行上述操作后， boot.img分成了两部分：boot.img-kernel和boot.img-ramdisk.gz，boot.img-kernel 是内核部分，这部分我们不能修改。boot.img-ramdisk.gz解压后得到的boot.img-ramdisk文件才是我们要修改的部分。

解压缩：

```bash
gzip -d boot.img-ramdisk.gz
```

解压及打开该文件的命令如下：

```bash
mkdir ramdisk
cd ramdisk
gzip -dc ../boot.img-ramdisk.gz | cpio -i
```

上述命令输出结果为： 10721 blocks

这样boot.img-ramdisk中的内容全部解压到了ramdisk目录下, 我们就可以修改需要想修改的地方。

### 2. 修改

对于我们要修改的是system分区挂载取消验证，这个在ramdisk中的fstab.qcom文件中。

```bash
cd ramdisk
vim fstab.qcom
# /dev/block/bootdevice/by-name/system         /system      ext4    ro,barrier=1,discard                                wait,verify
# -> /dev/block/bootdevice/by-name/system         /system      ext4    ro,barrier=1,discard                                wait
```

通过上述的修改即可。同样的，我们可以修改其他，比如system分区的挂载方式。

### 3. 打包

这一步是boot.img拆包的反过程。

- CPIO文件生成

在ramdisk目录下执行：

```bash
cpio -i -t -F ../boot.img-ramdisk | cpio -o -H newc -O ./boot.img-ramdisk_new
```

在当前目录下生成boot.img-ramdisk_new.

- 压缩

使用如下命令打包：

```bash
gzip boot.img-ramdisk_new
```

**注意**: 上述的方式存在问题，使得不能正确boot

可使用如下：

```bash
mkbootfs ./ramdisk | gzip > ramdisk-new.gz
```

- img打包

最后一步就是要生成boot.img了，这里需要一个工具mkbootimg，这个android源代码里编译而成的，如果你没有源代码，也可以直接去网上下载http://code.google.com/p/android-serialport-api/downloads/detail?name=android_bootimg_tools.tar.gz&can=2&q=。使用如下命令生成boot.img：

```bash
mkbootimg --cmdline "ignore_loglevel console=ttyHSL0,115200,n8 androidboot.console=ttyHSL0 androidboot.hardware=qcom msm_rtb.filter=0x237 ehci-hcd.park=3 lpm_levels.sleep_disabled=1 androidboot.bootdevice=7824900.sdhci earlycon=msm_hsl_uart,0x78af000" --kernel boot.img-kernel --ramdisk ramdisk-new.gz --base 0x7fff8000 --pagesize 2048 -o boot-new.img
```

- `--cmdline`可以通过查看boot.img的属性获取,也可以通过解包时的输出获取。
- `--pagesize`的值通过解包时的输出获取。
- `--base`的值需要通过计算。用kernel_addr - 偏移量0x00008000， kernel_addr通过`unpackbootimg`获取


该工具是32位的，如果在64位系统下运行则会出现"./mkbootimg: command not found"的错误，需要安装以下文件：

sudo apt-get install lib32stdc++6 lib32z1 lib32z1-dev

sudo apt-get install ia32-libs

这一步也可以这样做：

```bash
mkbootfs ./ramdisk | gzip > ramdisk.img
mkbootimg --cmdline "androidboot.hardware=qcom loglevel=1" --base 0x00200000 --pagesize 4096 --kernel boot.img-kernel --ramdisk ramdisk.img -o NewBoot.img
```

### 4. Flash

```bash
fastboot flash boot  boot-new.img
```

可重启手机验证boot.img是否制作正确。

## 3. Service.jar修改

由于MIUI对系统应用删除进行了限定，我们修改Service


### 3.1 反编译odex

先从手机将framework拷到电脑，services.jar，services.odex 这三个文件：

```bash
mkdir service
cd service 
cp /system/framework ./
cp /system/framework/services.jar ./
cp /system/framework/oat/arm64/services.odex ./
```

使用到的smali工具: https://bitbucket.org/JesusFreke/smali/downloads/  我们都使用2.4.0版本

执行如下命令：

```bash
java -jar baksmali-2.4.0.jar x services.odex -d framework/ -d framework/arm64/ -o services
# services/
# ├── android
# ├── com
# └── libcore
```

### 3.2 修改

在`com/miui/server/SecurityManagerService.smali`文件中搜索：

`".method private checkSystemSelfProtection(Z)V"`

修改如下

```smali
.method private checkSystemSelfProtection(Z)V
    .registers 3
    .param p1, "onlyCore"    # Z

    .prologue
    .line 652
    new-instance v0, Lcom/miui/server/SecurityManagerService$1;

    invoke-direct {v0, p0, p1}, Lcom/miui/server/SecurityManagerService$1;-><init>(Lcom/miui/server/SecurityManagerService;Z)V

    invoke-virtual {v0}, Lcom/miui/server/SecurityManagerService$1;->start()V

    .line 651
    return-void
.end method
```

to:

```smali
.method private checkSystemSelfProtection(Z)V
    .registers 3
    .param p1, "onlyCore"    # Z

    .prologue
    .line 652

    .line 651
    return-void
.end method
```

### 3.3 编译打包

- 方法1:

用 smali 将 .smali 转换成 dex:

```bash
java -jar smali-2.4.0.jar a services -o classes.dex
```

最终会在当前路径下生成 classes.dex， 然后将生成的.dex打包到.jar中去：

```bash
zip services.jar classes*.dex
```

最终生成的 services.jar 会包含 .dex。

将services.jar替换，删除services.odex即可。

- 方法2: 

先将smali编译成dex

```bash
java -jar smali-2.4.0.jar as services/ -a 24 -o services.dex
```

- as assemble的缩写
- -a 指定API版本
- -o 指定输出的dex文件

然后将dex编译成odex/oat， dex编译成odex/oat是在手机上进行的，所以生成了dex文件以后，我们把services.dex推到手机,

```bash
adb push services.dex /sdcard/
adb shell
export ANDROID_DATA=/data
export ANDROID_ROOT=/system
dex2oat --dex-file=/sdcard/services.dex --oat-file=/sdcard/services.odex  --instruction-set=arm64 --runtime-arg -Xms64m --runtime-arg -Xmx128m
```

- --dex-file 指定要编译的dex文件
- --oat-file 指定要输出的odex/oat文件
- --instruction-set 指定cpu架构
- --runtime-arg 指定dex2oat运行时的参数，如果编译时发生内存不足，可以把Xms和Xmx调大

## 4. 系统精简

各个应用的用途参考https://52huameng.com/teach/1557， 由于对services.jar进行了修改，不会卡米。

```bash
adb shell
cd /system/app
rm AnalyticsCore/ BookmarkProvider/ FM/ GameCenter/ HTMLViewer/ Health/ MSA/ MiDrive/ MiLinkService2/ MiRadio/ MiuiBug Report/ MiuiDaemon/ MiuiDriveMode/ MiuiSuperMarket/ PrintSpooler/  SogouInput/ Stk/ TouchAssistant/ Userguide VipAccount/ VoiceAssist/ VirtualSim/ XMPass/ greenguard/ mab/ -rf
cd /system/priv-app/
rm Backup BackupRestoreConfirmation/ Browser/ CallLogBackup/ CellBroadcastReceiver/ DownloadProviderUi/ Emergency Info/ MiGameCenterSDKService/ MiVRFramework/ MiuiVideo/ Music NewHome/  PicoTts/  QuickSearchBox/ Velvet/ -r
```

## 5. cust添加多国家

将global的cust/cust复制进cust分区。

```bash
adb shell
mkdir /cust
mount /dev/block/bootdevice/by-name/cust /cust
# Ubuntu
simg2img cust.img cust_ext4.img
mount -o loop cust_ext4.img /mnt
adb push /mnt/cust /cust/cust_global
# adb shell
adb shell
mv /cust/cust_global/* /cust/cust/
rm cust_variant
```

## 6. Google Services

TWRP recovery 刷入 GAPPS， 这样刷入开机出现了google验证黑屏，在这里我将Global版本的google服务复制进入/system/,能用，没有开机验证。

## Reference

[1] boot.img的修改, https://www.cnblogs.com/goodhacker/p/4106139.html
[2] Android Deodex https://www.dazhuanlan.com/2019/10/23/5db064015fc73/
[3] Android odex,oat文件的反编译，回编译 https://www.cnblogs.com/luoyesiqiu/p/11802947.html
