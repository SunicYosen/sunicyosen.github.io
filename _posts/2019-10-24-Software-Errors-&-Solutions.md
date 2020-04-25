---
layout: post
title: Software Errors and Solutions
date: 2019-10-24
category: Log
author: Sunic
tags: [errors, logs]
summary: 记录使用软件中的错误信息和解决方案
---

记录使用软件中的错误信息和解决方案.

## Usual Softwares and Problems

0. add-apt-repository: command not found

   ```bash
   sudo apt install software-properties-common
   # python3-software-properties software-properties-common unattended-upgrades
   ```

1. Teamviewer Top bar icons

   ```bash
   cd /usr/share/icons/
   sudo mv ./Papirus/22x22/apps/TeamViewer.svg ./Papirus/22x22/apps/TeamViewer.svg.old
   sudo cp ./Papirus/24x24/panel/teamviewer-indicator.svg ./Papirus/22x22/apps/TeamViewer.svg
   ```

2. Open Terminal Here Doesn't Work

   Open Terminal Here only open Gnome-Terminal at /home/user directory.

   **Solution:**

   关闭`Run a custom command instead of my shell` in Gnome-Terminal

   `gnome-terminal: Preferences -> Commnad`

   设置zsh为myshell可以通过以下方案：

   ```bash
   chsh -s `which zsh`
   # chsh -s /user/bin/zsh
   reboot
   ```

   参考[[1]](#rf1)<span id="rrf1"></span>

3. ibus-qt4 Doesn't work. As WPS

   Use `qt4-qtconfig`

   首先安装：

   ```bash
   sudo apt install qt4-qtconfig
   ```

   在Interface标签下设置，可以在默认输入法选择XIM,后续选定ibus,也没有问题。

   ***Reference***: [[0]](#rf0). <span id="rrf0"></span>

4. ibus rime 横向

参考[Github Issue](https://github.com/rime/ibus-rime/issues/52)

创建空白文件: `~/.config/ibus/rime/build/ibus_rime.yaml`

向`ibus_rime.yaml`写入并保存以下内容:

```yaml
style:
   horizontal: true
```

重新部署

## Professional Softwares and Problems

Include **`Android Studio`**， **`Hspice`**, **`VCS`**, **`Vivado`**

### Android Studio 

1. Failed to load module "canberra-gtk-module"

   ```bash
   sudo apt install libcanberra-gtk-module
   #  libcanberra-gtk-module libcanberra-gtk0
   ```

   Matlab 安装后，仍同样有这样的问题，解决办法：

   ```bash
   locale libcanberra-gtk-module.so
   sudo ln -s /usr/lib/x86_64-linux-gnu/gtk-2.0/modules/libcanberra-gtk-module.so /usr/lib/libcanberra-gtk-module.so
   # 因为linux默认库是从/usr/lib或者/usr/lib64下找，这时候只需要建立一个软连接就行了
   ```

### Hspice 

1. compile with `.hdl` Error.

    Simulator的仿真报错如下：

    ```markdown
    In file included from <stdin>:16:0:
    /usr/include/stdio.h:27:36: fatal error: bits/libc-header-start.h: No such file or directory
    #include <bits/libc-header-start.h>
    ```

    **解决方案：** ***Reference***: [[1]](#rf1). <span id="rrf1"></span>

    ```bash
    sudo apt install gcc-multilib
    # gcc-7-multilib gcc-multilib lib32asan4 lib32atomic1 lib32cilkrts5 lib32gcc-7-dev lib32gcc1 lib32gomp1 lib32itm1 lib32mpx2 lib32quadmath0 lib32stdc++6 lib32ubsan0 libc6-dev-i386 libc6-dev-x32 libc6-i386 libc6-x32 libx32asan4 libx32atomic1 libx32cilkrts5 libx32gcc-7-dev libx32gcc1 libx32gomp1 libx32itm1 libx32quadmath0 libx32stdc++6 libx32ubsan0
    ```

    之后会报：`cannot find crti.o: No such file or directory` 错误，

    **解决方案：** ***Reference***: [[2]](#rf2). <span id="rrf2"></span>

    ```bash
    sudo ln -s /usr/lib/x86_64-linux-gnu /usr/lib64
    # or add to .bashrc
    export LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:$LIBRARY_PATH
    ```

### Vivado

1. Vivado DocNav 报错： `libpng12.so.0: cannot open shared object file`

    **解决方案：** ***Reference***: [[3]](#rf3). <span id="rrf3"></span>

    ```bash
    wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
    # You can download the lastest by self.
    dpkg -i /tmp/libpng12.deb \
    rm /tmp/libpng12.deb
    ```

### VCS

1. `vcs: line 2993: dc: command not found`

    **Solutions:**

    ```bash
    sudo apt install dc
    ```

2. `vcs_save_restore_new.o`

    错误如下： 

    /usr/bin/ld: /home/SoftwareI/Synopsys/VCS_v2017.03/linux64/lib/vcs_save_restore_new.o: relocation R_X86_64_32S against undefined symbol `_sigintr' can not be used when making a PIE object; recompile with -fPIC
    /usr/bin/ld: final link failed: Nonrepresentable section on output
    collect2: error: ld returned 1 exit status
    Makefile:106: recipe for target 'product_timestamp' failed
    make: *** [product_timestamp] Error 1
    Make exited with status 2

    **Solutions:**

    ```bash
    sudo apt install gcc-4.8 g++-4.8
    # cpp-4.8 g++-4.8 gcc-4.8 gcc-4.8-base libasan0 libgcc-4.8-dev libstdc++-4.8-dev
    vcs -full64 -cpp g++-4.8 -cc gcc-4.8
    ```

3. `undefined reference to "xxx"`

    Such error like:  

    /home/SoftwareI/Synopsys/VCS_v2017.03/linux64/lib/libvcsnew.so: undefined reference to `snpsReallocFunc'
        
    /home/SoftwareI/Synopsys/VCS_v2017.03/linux64/lib/libvcsnew.so: undefined reference to `snpsCheckStrdupFunc'
        
    /home/SoftwareI/Synopsys/VCS_v2017.03/linux64/lib/libvcsnew.so: undefined reference to `ZsExecuteNBAs'

    **Solutions:**

    ```bash
    vcs -full64 -cpp g++-4.8 -cc gcc-4.8 -LDFLAGS -Wl,--no-as-needed
    ```
## Reference

<span id="rf0"></span> [[0]](#rrf0) Qt 下 ibus 托盘跟随问题, [OL], [https://blog.argcv.com/articles/2632.c](https://blog.argcv.com/articles/2632.c)

<span id="rf1"></span> [[1]](#rrf1) “fatal error: bits/libc-header-start.h: No such file or directory” while compiling HTK, [OL], [https://stackoverflow.com/questions/54082459/fatal-error-bits-libc-header-start-h-no-such-file-or-directory-while-compili](https://stackoverflow.com/questions/54082459/fatal-error-bits-libc-header-start-h-no-such-file-or-directory-while-compili)

<span id="rf2"></span> [[2]](#rrf2) Compiling problems: cannot find crt1.o, [OL], [https://stackoverflow.com/questions/6329887/compiling-problems-cannot-find-crt1-o](https://stackoverflow.com/questions/6329887/compiling-problems-cannot-find-crt1-o)

<span id="rf3"></span> [[3]](#rrf3) Ubuntu 17.04 libpng12.so.0: cannot open shared object file， [OL],[https://github.com/tcoopman/image-webpack-loader/issues/95](https://github.com/tcoopman/image-webpack-loader/issues/95)
