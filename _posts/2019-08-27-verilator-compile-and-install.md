---
layout: post
title: Verilator Compile and Install
date: 2019-08-27 09:16
category: Study
author: Sunic
tags: [Verilator, study]
summary: Compile and Install Verilator in Ubuntu18.04.3
---

在RISC-V的学习以及TVM-VTA的学习中，使用到了Verilator，因此记录其编译安装的方式。

Verilato作为开源的Verilog仿真器，使用方便。

## 1. Prepare

OS: Ubuntu 18.04.3
Dependence Instation:<span id='rrf1'></span>[[1]](#rf1)

```bash
sudo apt-get install git make autoconf g++ flex bison   # First time prerequisites
sudo apt-get install libfl2     # Ubuntu only (ignore if gives error)
sudo apt-get install libfl-dev  # Ubuntu only (ignore if gives error)
```

Clone source with git:

```bash
git clone http://git.veripool.org/git/verilator  $VerilatorSourcePATH  # Only first time
```

## 2. Compile & Install

编译前，对编译的版本选择：

```bash
cd verilator
git pull                   # Make sure we're up-to-date
git tag                    # See what versions exist
# git checkout master      # Use development branch (e.g. recent bug fix)
# git checkout stable      # Use most recent release
# git checkout v{version}  # Switch to specified release version
```

编译安装：

```bash
autoconf        # Create ./configure script
./configure --prefix=$VERILATOR_ROOT
# --prefix=/path/to/install 指定安装的目录

make -j`nproc` # make
# -j`nproc` 指定最大核心编译， 也可指定 -jn

sudo make install # install to path
```

安装后配置-环境变量设定：

```bash
# Verilator
export VERILATOR_ROOT=/path/to/install
export MYPATH=$MYPATH:$VERILATOR_ROOT/bin:$VERILATOR_ROOT/share/verilator/bin
export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:$VERILATOR_ROOT/share/pkgconfig
export MANPATH=$MANPATH:$VERILATOR_ROOT/share/man
export CPLUS_INCLUDE_PATH=$VERILATOR_ROOT/share/verilator/include
```

## 3. Problems

## 4. Reference

<span id="rf1"></span>[[1]](#rrf1): Installing Verilator, [OL], 2019-08-27, [https://www.veripool.org/projects/verilator/wiki/Installing](https://www.veripool.org/projects/verilator/wiki/Installing)

## 5. Update Logs

2019.08.27: Write the Base Document.
