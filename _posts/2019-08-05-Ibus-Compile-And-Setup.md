---
layout: post
title: Ibus Compile and Setup
date: 2019-08-05 23:44
category: Skills
author: Sunic
tags: ['Ibus Compile', 'Input Method', 'ibus rime', 'fcitx5']
summary: 
---

在使用Linux时，中文输入法不可或缺。在Ubuntu18.04.3平台上，先后使用了fcitx、fcitx-sogou、ibus等输入方案，各有优缺点。以目前使用的Ibus+rime方案为主，值此总结。

## Fcitx

### Install

Fcitx -- A Flexible Input Method Framework. 一种输入框架。在Ubuntu18上可以通过Apt安装

```bash
sudo apt install fcitx
```

其下包含了很多的输入法，可以按需安装。比如fcitx-pinyin/fcitx-libpinyin/fcitx-module-cloudpinyin/fcitx-rime等。

为了支持多种图像界面，需要安装如下：

```bash
sudo apt install fcitx-frontend-gtk2
sudo apt install fcitx-frontend-gtk3
sudo apt install fcitx-frontend-qt4
sudo apt install fcitx-frontend-qt5
```

### Configure

使用系统的输入法设置工具设置:

```bash
im-config
```

选择fcitx即可。

另一方面，fcitx不能在setting->Region & Language中选择。

### Fcitx Problem

1. 在gnome的桌面平台上，Fcitx的兼容型不好，在Gnome Search中不能正常使用。
2. 同时，不能和系统输入法之间实现ctrl+space的切换。
3. Tray图标和设置混乱。

### Sogou PinYin

Sogou Pinyin是Sogou推出的基于Fcitx输入框架的输入法，可以在官网下载直接安装。

```bash
sudo dpkg -i xxx
sudo apt install -f
```

然后通过使用`fcitx-congfigure`工具对sogou输入法进行配置。

Sogou Pinyin输入法存在的问题主要是其不太稳定，会时常崩溃。并且继承了Fcitx框架的所有的问题。

## Fcitx5

***注：编译成功，但未能启动pinyin输入法***

Fcitx5是Fcitx的作者对Fcitx的更新。-- Maybe a new fcitx.

在Archlinux上可以通过pacman或者yaourt安装,在Ubuntu上需要编译安装。

<span id="rrf1"></span>[[1]](#rf1)

### Compile

1. xcb-imdkit

   ```bash
   git clone https://gitlab.com/fcitx/xcb-imdkit.git
   cd xcb-imdkit
   mkdir build && cd $_ && cmake .. && make -j`nproc` && sudo make install
   ```

2. fcitx5

   ```bash
   git clone https://gitlab.com/fcitx/fcitx5.git
   apt install libfmt-dev
   cd fcitx5
   mkdir build && cd $_ && cmake .. && make -j`nproc` && sudo make install
   ```

3. libime

   先确保你的 $LANG 是 en_US.UTF-8

   ```bash
   echo $LANG
   # en_US.UTF-8
   git clone https://gitlab.com/fcitx/libime.git
   cd libime
   git submodule update --init
   mkdir build && cd $_ && cmake .. && make -j`nproc` && sudo make install
   ```

4. fcitx5-gtk

   ```bash
   git clone https://gitlab.com/fcitx/fcitx5-gtk.git
   cd fcitx5-gtk
   mkdir build && cd $_ && cmake .. && make -j`nproc` && sudo make install
   ```

5. fcitx5-qt

   ```bash
   git clone https://gitlab.com/fcitx/fcitx5-qt.git
   apt install qtbase5-private-dev
   cd fcitx5-qt
   mkdir build && cd $_ && cmake .. && make -j`nproc` && sudo make install
   ```

6. fcitx5-chinese-addons

   ```bash
   git clone https://gitlab.com/fcitx/fcitx5-chinese-addons.git
   cd fcitx5-chinese-addons
   mkdir build && cd $_ && cmake .. && make -j`nproc` && sudo make install
   ```

在编译安装的过程中可能会缺少依赖，可以根据错误的提示进行安装。根据上述的流程，我们也可以编译fcitx5-rime，使用rime输入法。

在编译过程中，我使用的是自己编译安装的Qt5.12，没有问题，使用Ubuntu自带的5.9.5版本可能会有问题。Qt5.12配置如下：

```bash
#Qt
export QTHOME=/home/SoftwareI/Qt
export MYPATH=$MYPATH:$QTHOME/Tools/QtCreator/bin
export MYPATH=$MYPATH:$QTHOME/5.12.0/gcc_64/bin
export QT_WEBKIT=true
export QTDIR=$QTHOME/5.12.0/gcc_64
export PATH=$QTDIR/bin:$PATH
export LD_LIBRARY_PATH=$QTDIR/lib:$LD_LIBRARY_PATH
```

接下来在环境变量中设置：

```bash
export GTK_IM_MODULE=fcitx5
export QT_IM_MODULE=fcitx5
export QT5_IM_MODULE=fcitx5
export XMODIFIERS=@im=fcitx5
```

在`vim  ~/.config/fcitx5/profile`中配置中文输入法，大致如下：

```bash
[Groups/0]
# Group Name
Name=Default
# Layout
Default Layout=us
# Default Input Method
DefaultIM=pinyin

[Groups/0/Items/0]
# Name
Name=keyboard-us
# Layout
Layout=

[Groups/0/Items/1]
# Name
Name=pinyin
# Layout
Layout=

[GroupOrder]
0=Default
```

Fcitx5目前仍在开发中，在功能上很不完善。

## IBus

IBus -- Intelligent Input Bus. 和Fcitx一样，是输入法框架。

IBus在Ubuntu等Gnome桌面支持很好，是Gnome下推荐的输入法框架。在Ubuntu下可以通过`apt`直接安装。

```bash
sudo apt install ibus
sudo apt install ibus-qt4 # for qt4 apps
sudo apt install gtk      # for gtk2 apps
sudo apt install gtk3     # for gtk3 apps
```

### Compile Ibus

Ibus可以通过源码编译。（参考`ibus`下的`INSTALL`

```bash
git clone git@github.com/ibus/ibus.git
cd ibus
./autogen.sh --prefix='/usr' --sysconfdir='/etc' --libdir='/usr/lib' --enable-gtk-doc
make -j4
sudo make install
```

### Compile IBus-qt

Ibus对qt应用的支持需要通过编译安装Ibus-qt，编译过程如下：（参考`ibus-qt`中`INSTALL`脚本）

```bash
git clone git@github.com/ibus/ibus-qt.git
cd ibus-qt
mkdir build
cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_BUILD_TYPE=Debug -DCMAKE_CXX_FLAGS="-Wall" # -DLIBDIR=lib64
make VERBOSE=1
make install # DESTDIR=
make docs    # to create API document
```

## RIME

同样的在Ibus框架下，同样支持RIME输入法。

RIME输入发可以通过编译安装。

```bash
git clone git@github.com/rime/ibus-rime.git
git submodule update --init
cd librime
mkdir build
cd build
cmake ..
make
sudo make install
```

Rime可以仅安装librime模块，而不通过plum配置。

### Set Up

rime配置的文件夹在`.config/ibus/rime`
通过添加或修改yaml文件即可。

具体可参考： [https://github.com/rime/plum](https://github.com/rime/plum)

## Problem

## Reference

<span id="rf1"></span>[[1]](#rrf1) Debian 9 testing 下安装 fcitx5, [OL], [https://zhuanlan.zhihu.com/p/50626515](https://zhuanlan.zhihu.com/p/50626515)

## Update Log

1. 2019.08.10 Write the base
