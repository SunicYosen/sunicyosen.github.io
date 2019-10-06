---
layout:     post
title:      Install Ubuntu Log
date:       2019-09-22 08:40 +0800
categories: Skills
author:     Sunic
tags:       [Ubuntu, Install]
summary:    The log of Install and Use Ubuntu
---

作为经常更新Ubuntu系统，重装系统的人，记录下安装和使用的基本流程，方便下次的重新开始。

## After Install

安装使用Ubuntu18.04.3版本制作的U盘启动盘，最小化安装。安装后首先更换源，然后更新：

`/etc/apt/sources.list`中的网址修改为[http://ftp.sjtu.edu.cn/ubuntu/]( http://ftp.sjtu.edu.cn/ubuntu/)

```bash
sudo apt update
sudo apt upgrade
sudo apt autoremove
```

### 1. Ubuntu -> Gnome

```bash
sudo apt remove ubuntu-session
# ubuntu-desktop ubuntu-session

sudo apt autoremove
# fonts-liberation2 fonts-opensymbol gir1.2-geocodeglib-1.0 gir1.2-gst-plugins-base-1.0 gir1.2-gstreamer-1.0 gir1.2-gudev-1.0 gir1.2-udisks-2.0 gnome-themes-extra gnome-themes-extra-data grilo-plugins-0.3-base gstreamer1.0-gtk3 gtk2-engines-pixbuf libboost-date-time1.65.1 libboost-filesystem1.65.1 libboost-iostreams1.65.1 libboost-locale1.65.1 libcdr-0.1-1 libclucene-contribs1v5 libclucene-core1v5 libcmis-0.5-5v5 libcolamd2 libdazzle-1.0-0 libe-book-0.1-1 libedataserverui-1.2-2 libeot0 libepubgen-0.1-1 libetonyek-0.1-1 libevent-2.1-6 libexiv2-14 libfreerdp-client2-2 libfreerdp2-2 libgc1c2 libgee-0.8-2 libgexiv2-2 libgom-1.0-0 libgpgmepp6 libgpod-common  libgpod4 liblangtag-common liblangtag1 liblirc-client0 liblua5.3-0 libmediaart-2.0-0 libmspub-0.1-1 libodfgen-0.1-1 libqqwing2v5 libraw16 librevenge-0.0-0 libsgutils2-2 libssh-4 libsuitesparseconfig5 libvncclient1 libwinpr2-2 libxapian30 libxmYlsec1 libxmlsec1-nss lp-solve media-player-info python3-mako python3-markupsafe syslinux syslinux-common syslinux-legacy usb-creator-common xwayland

sudo apt install gnome-session
# adwaita-icon-theme-full fonts-cantarell gnome-session gnome-themes-extra gnome-themes-extra-data gtk2-engines-pixbuf xwayland
```

### 2. Remove no-use applications

```bash
sudo apt remove ubuntu-report ubuntu-settings ubuntu-advantage-tools
# ubuntu-advantage-tools ubuntu-minimal ubuntu-report ubuntu-settings

sudo apt remove ubuntu-artwork
# ubuntu-artwork

sudo apt autoremove
# adium-theme-ubuntu gtk2-engines-murrine light-themes

sudo apt remove ubuntu-docs
# gnome-getting-started-docs gnome-user-docs gnome-user-guide ubuntu-docs

sudo apt remove ubuntu-drivers-common
# apturl gnome-software gnome-software-plugin-snap nautilus-share software-properties-gtk ubuntu-drivers-common ubuntu-software

sudo apt autoremove
# apturl-common gir1.2-goa-1.0 gir1.2-snapd-1 gnome-software-common python3-dateutil python3-software-properties python3-xkit session-migration software-properties-common unattended-upgrades

sudo apt remove ubuntu-standard
sudo apt autoremove
# busybox-static command-not-found command-not-found-data dnsutils   friendly-recovery ftp hdparm info iputils-tracepath irqbalance libirs160 libnih1 libnuma1 lshw lsof ltrace mtr-tiny nano popularity-contest python3-commandnotfound python3-gdbm rsync strace tcpdump telnet time ufw ureadahead usbutils

# Acording to needed Install:
sudo apt install ftp lshw usbutils dnsutils libirs160

sudo apt remove ubuntu-release-upgrader-core
# ubuntu-release-upgrader-core ubuntu-release-upgrader-gtk update-manager update-manager-core update-notifier update-notifier-common

sudo apt autoremove
# gir1.2-dbusmenu-glib-0.4 gir1.2-dee-1.0 gir1.2-javascriptcoregtk-4.0 gir1.2-unity-5.0 gir1.2-webkit2-4.0 python3-debconf python3-debians python3-distro-info python3-distupgrade python3-update-manager

sudo apt remove ubuntu-system-service
# ubuntu-system-service:amd64 (0.3.1)

sudo apt remove ubuntu-mono
sudo apt autoremove
# humanity-icon-theme

sudo apt remove gnome-menus
# gnome-menus:amd64 (3.13.3-11ubuntu1.1)

sudo apt remove gnome-shell-extension-appindicator
# gnome-shell-extension-appindicator:amd64 (18.04.1)

sudo apt remove gnome-shell-extension-ubuntu-dock
# gnome-shell-extension-ubuntu-dock:amd64 (0.9.1ubuntu18.04.3)

sudo apt remove snapd --purge

# sudo snap remove gtk-common-themes
# sudo snap remove gnome-system-monitor
# sudo snap remove gnome-logs
# sudo snap remove gnome-characters
# sudo snap remove gnome-calculator
# sudo snap remove gnome-3-28-1804
# sudo snap remove core28
# snapd:amd64 (2.40+18.04)

sudo apt remove ibus-table
```

### 3. Theme

```bash
sudo apt install gnome-tweaks
# gnome-tweaks:amd64 (3.28.1-1)

sudo apt install papirus-icon-theme
#  papirus-icon-theme:amd64 (20180401-1)
```

然后使用tweaks设置主题。

### 4. gnome-shell-extensions

```bash
sudo apt install chrome-gnome-shell
# chrome-gnome-shell:amd64 (10-1) [firefox & Chrome]
```

然后安装浏览器的插件，即可通过浏览器管理。

安装的gnome-shell extensions:

- netspeed: [netspeed](https://extensions.gnome.org/extension/104/netspeed/)
- dash to dock: [dash to dock](https://extensions.gnome.org/extension/307/dash-to-dock/)
- Remove Dropdown Arrows: [Remove Dropdown Arrows](https://extensions.gnome.org/extension/800/remove-dropdown-arrows/)
- Status Area Horizontal Spacing: [Status Area Horizontal Spacing](https://extensions.gnome.org/extension/355/status-area-horizontal-spacing/)
- KStatusNotifierItem/AppIndicator Support: [KStatusNotifierItem/AppIndicator Support](https://extensions.gnome.org/extension/615/appindicator-support/)
- Workspace Indicator: [Workspace Indicator](https://extensions.gnome.org/extension/21/workspace-indicator/)

对于其状态栏目的位置，可以通过修改其中的`addToStatusArea`的参数来修改。

### 5. 输入法

使用ibus-rime输入法。

```bash
sudo apt install ibus ibus-gtk2 ibus-gtk3
sudo apt install ibus-rime
#  ibus-rime:amd64 (1.2-1build2), libgoogle-glog0v5:amd64 (0.3.5-1, automatic), libmarisa0:amd64 (0.2.4-8build12, automatic), librime-data-luna-pinyin:amd64 (0.35-1, automatic), librime-data-cangjie5:amd64 (0.35-1, automatic), libopencc2:amd64 (1.0.4-5, automatic), libopencc2-data:amd64 (1.0.4-5, automatic), librime-bin:amd64 (1.2.9+dfsg2-1, automatic), libboost-regex1.65.1:amd64 (1.65.1+dfsg-0ubuntu5, automatic), librime1:amd64 (1.2.9+dfsg2-1, automatic), libleveldb1v5:amd64 (1.20-2, automatic), librime-data:amd64 (0.35-1, automatic), libboost-filesystem1.65.1:amd64 (1.65.1+dfsg-0ubuntu5, automatic), libyaml-cpp0.5v5:amd64 (0.5.2-4ubuntu1, automatic), libgflags2.2:amd64 (2.2.1-1, automatic)
```

可配之为小鹤双拼。

### 6. zsh

安装zsh包：

```bash
sudo apt install zsh
#  zsh:amd64 (5.4.2-3ubuntu3.1), zsh-common:amd64 (5.4.2-3ubuntu3.1, automatic)
```

配置oh-my-zsh.

使用File/Projects/oh-my-zsh作链接:(Set up fstab first)

```bash
cd ~
ln -s File/Projects/oh-my-zsh .oh-my-zsh
ln -s File/Projects/oh-my-zsh/myzsh/zshrc.sh .zshrc
ln -s File/Projects/oh-my-zsh/myzsh/myrc.sh .myrc.sh
```

### 7. Freedom -> v2ray

使用v2ray Freedom; 使用脚本安装。

```bash
wget https://install.direct/go.sh ../SoftwareI/Myshell/update-v2ray.sh
sudo ../SoftwareI/Myshell/update-v2ray.sh
sudo systemctl stop v2ray.service
sudo systemctl start v2ray.service
sudo mkdir /var/v2ray
sudo touch /var/v2ray/access.log
```

v2ray使用socks5代理: 127.0.0.1:1080

如果使用privoxy，可以编辑编辑脚本：.zshrc/.myrc.sh

```bash
export http_proxy='xxx'
export https_proxy='xxx'
export HTTP_PROXY='xxx'
export HTTPS_PROXY='xxx'
```

### 8. code

可以使用vim或者vs code.

vim可以直接使用apt安装：

```bash
sudo apt install vim
# vim-runtime
```

VS Code 可以在官网下载安装包：

[VS Code](https://code.visualstudio.com/download)

```bash
sudo dpkg -i xxx.deb
sudo apt install -f
# libxss1
sudo apt update
```

会将Code的安装源加入Ubuntu目录： [/etc/apt/sources.list.d](file:///etc/apt/sources.list.d)

### 9. git

```bash
sudo apt install git
# git git-man liberror-perl
cp File/Temp/.gitconfig ~/
```

### 10. geary

```bash
sudo add-apt-repository ppa:geary-team/releases
sudo apt update
sudo apt install geary
# geary libgee-0.8-2 libgmime-2.6-0 libmessaging-menu0
```

可以使用gnome的gnome-account登录Outlook和Gmail.

## Use Log

以上Install介绍了基本的需求，下面就是基本的使用。主要是应用的安装。

### 1. Install APPS

1. google chrome
   下载地址： [google chrome](https://www.google.com/intl/zh-CN/chrome/)

2. aria2

   设置aria2的方式，将aria2.conf -> ~/.aria2/

   ```bash
   sudo apt install aria2
   # aria2 libc-ares2
   mv ~/File/Temp/.config/aria2.conf ~/.config/
   ```

3. WPS-office

   从[WPS](http://wps-community.org/downloads)下载最新的版本。

   ```bash
   sudo dpkg -i xxx.deb
   ```

   需要安装WPS Fonts来顺利使用，具体参见[Fonts](#fonts)的安装。

4. Qt

   在[http://download.qt.io/archive/qt/](http://download.qt.io/archive/qt/)下载.然后命令行下执行安装.

   将.myrc.sh中关于QT的环境变量配置上:

   ```bash
   export QTHOME=/home/SoftwareI/Qt
   export QTDIR=$QTHOME/5.13.1/gcc_64
   export QT_WEBKIT=true
   export MYPATH=$MYPATH:$QTHOME/Tools/QtCreator/bin
   export MYPATH=$MYPATH:$QTDIR/bin
   export PKG_CONFIG_PATH=$QTDIR/lib/pkgconfig
   export QT_PLUGIN_PATH=$QTDIR/plugins/
   export LD_LIBRARY_PATH=$QTDIR/lib:$LD_LIBRARY_PATH
   export LD_LIBRARY_PATH=$QT_PLUGIN_PATH/   platforms:$LD_LIBRARY_PATH
   ```

   可以使用qtchooser:

   ```bash
   qtchooser -install NAMEQT /Path to Qt Installation Dir/Version/Platform/bin/qmake
   # 2)Create symbol link: ln -s NAMEQT.conf default.conf
   # Attention 1: NAMEQT.conf usually in :
   #  $HOME/.config/qtchooser (NON Super User)
   #  /usr/lib/x86_64-linux-gnu/qt-default/qtchooser (Super    User)
   # Attention 2: Some Qt-chooser Dir:
   # [/usr/bin/qtchooser] [/usr/lib/x86_64-linux-gnu/qtchooser] [/usr/share/qtchooser]
   ```

5. megasync

   在官网下载安装，[https://mega.nz/sync](https://mega.nz/sync), 需要翻墙下载最新的版本.

   ```bash
   sudo dpkg -i xxx.deb
   sudo apt install -f
   # libcrypto++6 libdouble-conversion1 libmediainfo0v5    libmms0 libqt5core5a libqt5dbus5 libqt5gui5 libqt5network5    libqt5svg5 libqt5widgets5 libraw16 libtinyxml2-6    libxcb-xinerama0 libzen0v5 qt5-gtk-platformtheme    qttranslations5-l10n
   ```

6. transmission

   BT软件,可用来下载pt

   ```bash
   sudo add-apt-repository ppa:transmissionbt/ppa
   sudo apt-get update
   sudo apt install transmission
   # libevent-2.1-6 libminiupnpc10 libnatpmp1 transmission       transmission-common transmission-gtk
   ```

7. htop

   ```bash
   sudo apt install htop
   ```

8. goldendict

   字典软件, 可本地字典和线上程序等.

   ```bash
   sudo apt install goldendict
   # goldendict libeb16 libqt5help5 libqt5positioning5    libqt5printsupport5 libqt5qml5 libqt5quick5 libqt5sensors5    libqt5sql5 libqt5sql5-sqlite libqt5webchannel5    libqt5webkit5 libqt5x11extras5 libqt5xml5
   ```

   设置Google Translate. 参考[GoogleTranslate](file://home/sun/   File/Programs/Python/GoogleTranslate/)

9. vlc

   ```bash
   sudo apt install vlc
   # libaribb24-0 libbasicusageenvironment1 libcddb2 libdc1394-22 libdca0 libdvbpsi10 libebml4v5 libfaad2 libgroupsock8 libkate1 liblirc-client0 liblivemedia62 liblua5.2-0 libmad0 libmatroska6v5 libmicrodns0 libmpcdec6 libnfs11 libopenmpt-modplug1 libplacebo4 libprotobuf-lite10 libproxy-tools libresid-builder0c2a libsdl-image1.2 libsdl1.2debian libsidplay2 libsndio6.1 libssh2-1 libupnp6 libusageenvironment3 libvlc-bin libvlc5 libvlccore9 libvulkan1 vlc vlc-bin vlc-data vlc-l10n vlc-plugin-base vlc-plugin-notify vlc-plugin-qt vlc-plugin-samba vlc-plugin-skins2 vlc-plugin-video-output vlc-plugin-video-splitter vlc-plugin-visualization
   ```

10. teamviewer

    Teamviewer Download : [Teamviewer](https://www.teamviewer.com/en-us/download/linux/)

    ```bash
    sudo dpkg -i xx.deb
    # qml-module-qtgraphicaleffects qml-module-qtquick-controls qml-module-qtquick-dialogs qml-module-qtquick-layouts qml-module-qtquick-privatewidgets qml-module-qtquick-window2 qml-module-qtquick2
    ```

11. lsb

    Required by Synopsys SCL

    ```bash
    sudo apt install lsb
    # alien at autoconf automake autopoint autotools-dev build-essential debhelper debugedit dh-autoreconf dh-strip-nondeterminism   dpkg-dev fakeroot g++ g++-7 gcc gcc-7 guile-2.0-libs libalgorithm-diff-perl libalgorithm-diff-xs-perl libalgorithm-merge-perl  libarchive-cpio-perl libasan4 libatomic1 libc-dev-bin libc6-dev libcilkrts5 libfakeroot libfile-stripnondeterminism-perl libgc1c2 libgcc-7-dev libgsasl7 libitm1 libjpeg62 libkyotocabinet16v5 liblsan0 libltdl-dev liblua5.2-0 libmail-sendmail-perl libmailutils5 libmpx2 libmysqlclient20 libntlm0 libquadmath0 librpm8 librpmbuild8 librpmio8 librpmsign8 libsigsegv2 libstdc++-7-dev libsys-hostname-long-perl libtool libtsan0 libubsan0 linux-libc-dev lsb lsb-core lsb-invalid-mta lsb-printing lsb-security m4 mailutils mailutils-common make manpages-dev mysql-common ncurses-term pax po-debconf rpm rpm-common rpm2cpio rsync time
    ```

12. fastboot

    For android

    ```bash
    sudo apt install fastboot
    # adb android-libadb android-libbacktrace android-libbase  android-libboringssl android-libcrypto-utils android-libcutils android-libetc1 android-libf2fs-utils android-liblog android-libsparse android-libunwind android-libutils android-libziparchive android-sdk-platform-tools android-sdk-platform-tools-common dmtracedump etc1tool f2fs-tools fastboot graphviz hprof-conv libann0 libcdt5 libcgraph6 libf2fs-format4 libf2fs5 libgts-0.7-5 libgts-bin libgvc6 libgvpr2 liblab-gamut1 libpathplan4 p7zip p7zip-full sqlite3
    ```

13. gimp

    ```bash
    sudo add-apt-repository ppa:otto-kesselgulasch/gimp
    sudo apt-get update
    sudo apt install gimp
    # gimp gimp-data libamd2 libbabl-0.1-0 libblas3 libcamd2 libccolamd2 libcholmod3 libcolamd2 libde265-0 libexiv2-14 libgegl-0.4-0 libgegl-common  libgexiv2-2 libgfortran4 libgimp2.0 libheif1 liblapack3 libmetis5 libmng2 libmypaint-1.3-0 libmypaint-common libsuitesparseconfig5 libumfpack5
    ```

14. Krita `[Give up]`

    ```bash
    sudo add-apt-repository ppa:kritalime/ppa
    sudo apt-get update
    sudo apt install krita
    # krita krita-data kwayland-data kwayland-integration libfam0 libgif7 libgsl23  libgslcblas0 libkf5archive5 libkf5completion-data libkf5completion5 libkf5config-bin libkf5config-data libkf5configcore5 libkf5configgui5  libkf5coreaddons-data libkf5coreaddons5 libkf5crash5 libkf5guiaddons5 libkf5i18n-data libkf5i18n5 libkf5idletime5 libkf5itemviews-data libkf5itemviews5 libkf5waylandclient5 libkf5widgetsaddons-data libkf5widgetsaddons5 libkf5windowsystem-data libkf5windowsystem5 libopencolorio1v5 libpoppler-qt5-1 libqt5concurrent5 libqt5designer5 libqt5multimedia5 libqt5quickwidgets5 libqt5script5 libqt5test5 libqt5waylandclient5 libqt5waylandcompositor5 libquazip5-1 libtinyxml2.6.2v5 python3-pyqt5 python3-sip qtwayland5
    sudo apt install krita-nautilus-thumbnailer
    # krita-nautilus-thumbnailer xcftools
    ```

15. inkscape

    ```bash
    sudo add-apt-repository ppa:inkscape.dev/trunk
    sudo apt update
    sudo apt install inkscape
    # fonts-lato inkscape-trunk inkscape-trunk-data javascript-common libatkmm-1.6-1v5 libcairomm-1.0-1v5 libcdr-0.1-1 libgdl-3-5 libgdl-3-common libglibmm-2.4-1v5 libgtkmm-3.0-1v5 libgtkspell3-3-0 libimage-magick-perl libimage-magick-q16-perl libjs-jquery libmagick++-6.q16-7 libpangomm-1.4-1v5  libpotrace0 libpython-stdlib librevenge-0.0-0 libruby2.5 libsigc++-2.0-0v5 libvisio-0.1-1 libwmf-bin libwpd-0.10-10 libwpg-0.3-3 perlmagick python  python-bs4 python-chardet python-html5lib python-lxml python-minimal python-numpy python-pkg-resources python-scour python-six python-webencodings python2.7 python2.7-minimal python3-scour rake ruby ruby-did-you-mean ruby-minitest ruby-net-telnet ruby-power-assert ruby-test-unit ruby2.5 rubygems-integration scour
    ```

16. open-jdk

    ```bash
    sudo apt install openjdk-11-jdk
    # ca-certificates-java fonts-dejavu-extra java-common libatk-wrapper-java libatk-wrapper-java-jni libgif7 libice-dev libpthread-stubs0-dev libsm-dev libx11-dev libx11-doc libxau-dev libxcb1-dev libxdmcp-dev libxt-dev openjdk-11-jdk openjdk-11-jdk-headless openjdk-11-jre openjdk-11-jre-headless x11proto-core-dev x11proto-dev xorg-sgml-doctools xtrans-dev
    ```

17. sbt

    ```bash
    echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 642AC823
    sudo apt-get update
    sudo apt-get install sbt
    ```

18. subtitleeditor

    ```bash
    sudo apt install subtitleeditor
    # libgstreamermm-1.0-1 libsubtitleeditor0 libxml++2.6-2v5 subtitleeditor
    ```

### 2. Setup

1. Key Binding

   | Behavior | Key   |
   |:--------:|:-----:|
   |Switch to workspace 1|Alt+1|
   |Switch to workspace 2|Alt+2|
   |Switch to workspace 3|Alt+3|
   |Switch to workspace 4|Alt+4|
   |Copy a screenshot of an area to clipboard| Print|

2. Fonts <span id="fonts"></span>

    - WPS Fonts
    - Windows Fonts
    - Adobe Fonts

    ```bash
    mkfontsdir
    mkfontscale
    sudo fc-cache -fv
    ```

3. fstab setup

    Reference the backup fstab file.

    Use `blkid` to get UUID

    ```bash
    #Mount Disks
    UUID=ec6847c4-0611-4cde-bc59-bd6222383d63 /home/sun/File ext4 defaults 0 0
    UUID=78878620-0fd9-42df-91da-9fa79c708fa0 /home/SoftwareI ext4 defaults 0 0
    UUID=aa3a6180-d95a-4bb1-999d-8afaaa018d1a /home/SoftwareII ext4 defaults 0 0
    ```

## Problem

1. Android Studio -- Failed to load module "canberra-gtk-module"

   ```bash
   sudo apt install libcanberra-gtk-module
   #  libcanberra-gtk-module libcanberra-gtk0
   ```

2. add-apt-repository: command not found

   ```bash
   sudo apt install software-properties-common
   # python3-software-properties software-properties-common unattended-upgrades
   ```

3. Teamviewer Top bar icons

   ```bash
   cd /usr/share/icons/
   sudo mv ./Papirus/22x22/apps/TeamViewer.svg ./Papirus/22x22/apps/TeamViewer.svg.old
   sudo cp ./Papirus/24x24/panel/teamviewer-indicator.svg ./Papirus/22x22/apps/TeamViewer.svg
   ```

4. Open Terminal Here Doesn't Work

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

## Reference

<span id="rf1"></span> [[1]](#rrf1) ubuntu 14.04下配置terminal为zsh默认环境 [OL], [https://blog.csdn.net/zxgdll/article/details/70858857](https://blog.csdn.net/zxgdll/article/details/70858857)

## Update

1. 2019.10.05: Modified the style and error in markdown
