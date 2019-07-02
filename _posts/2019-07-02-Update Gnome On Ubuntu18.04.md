---
layout:     post
title:      "Update Gnome On Ubuntu18.04"
date:       2019-07-02
categories: Study
tags:       Ubuntu Gnome Update Study
---

Yes, it is possible to upgrade any software you want from any ubuntu release if you're willing to do things a little unconventionally and have to deal with more complexity, potential risk and issues of compatibility.

I too could not upgrade to 18.10 as it breaks some essential software for me. On the other hand, Gnome 3.30 is by far superior to 3.28 and 3.26 in terms of stability and performance. Most especially true for Gnome Wayland which goes from disastrous to actually usable as of 3.30...

Here is the general gist of what I did:

temporarily modify apt repo list to use cosmic's repos instead of bionic.
update ONLY gnome shell to 3.30 and the files it needs to run in a stable manner and nothing more.
make a list of the files updated in 2.
undo step 1, so that the rest of the packages on the machine can use the LTS updates
the rest of the packages can be updated normally but the files I updated in 2 will need to be updated manually via a script that will be built with the list made in step 3.
I've made a very thorough tutorial on how to do this. Should you follow this closely, you should not have any trouble but know that there are no guaranties and that you are playing with things that could break an install, so backup your install before doing this or do this on a virtual machine to see how it goes for you.

## Prep

Unless I specify otherwise, assume all commands are in elevated privileges and that I just don't feel like typing sudo 100 times. To go into sudo mode enter:

> sudo -H bash #or sudo su

Before doing anything, make sure all is in order by running:

> apt-get --fix-broken install

## Step 1

Make a copy of the original and temporarily modifiy the apt repository lists so that it checks the cosmic repos for updates instead of the bionic ones:

> cp /etc/apt/sources.list /etc/apt/sources.list.bionic

> #make a cosmic version of the apt list \
> cat /etc/apt/sources.list.bionic| sed 's/bionic/cosmic/g' > /etc/apt/sources.list.cosmic

> #set the apt list to cosmic \
> cp /etc/apt/sources.list.cosmic /etc/apt/sources.list

> #backup your two list files to another directory - just in case some smart ass updater decides to delete them. \
> mkdir /etc/apt.bak \
> cp /etc/apt/sources.* /etc/apt.bak \

## Step 2

update package lists and check for upgradable packages:

> apt update \
> apt list --upgradable > upgradable

## Step 3

Using grep, run a text based search for the number 3.30 and 3.28 which should only show you the updates related to the gnome shell. Additionally you can search for packages related to wayland (essential!) and glib, gir, gtk (up to you). I really don't care about xorg as I think it's terribly insecure but if you want to use gnome-x11, you can search for xorg packages to update as well. The idea behind this approach is to avoid upgrading too many packages to the cosmic branch because cosmic only has 9 months of fixes and bionic will have 5-10 years of security updates and fixes, so it is to your interest to keep as much of your system as possible on the bionic line.

> #updates directly related to 3.30 or needed by it. \
> cat upgradable | grep "3.30" | grep --color=NEVER "3.28" > upgradable-3.30 #this got me 78 packages \
> cat upgradable | grep --color=NEVER -i "nautilus" >> upgradable-3.30 #if you endup choosing to do step 9, don't do this \
> cat upgradable | grep --color=NEVER -i "gdm" >> upgradable-3.30 \
> cat upgradable | grep --color=NEVER -i "gnome-shell-extension-appindicator" >> upgradable-3.30 \
> cat upgradable | grep --color=NEVER -i "gnome-shell-extension-ubuntu-dock" >> upgradable-3.30\
> cat upgradable | grep --color=NEVER -i "gvfs" >> upgradable-3.30 \
> cat upgradable | grep --color=NEVER -i "network-manager" >> upgradable-3.30

> #wayland \
> cat upgradable | grep --color=NEVER -i "wayland" > upgradable-wayland

> #x11 \
> cat upgradable | grep --color=NEVER -i "xorg" > upgradable-xorg \
> cat upgradable | grep --color=NEVER -i "x11" >> upgradable-xorg \
> cat upgradable | grep --color=NEVER -i "xorg" > upgradable-xorg \

The same as qt:
> cat upgradable | grep --color=NEVER -i "qt" > upgradable-qt \

Not sure how necessary the upgrades below are (I would imagine that the library packages needed for the healthy functioning of gnome-shell 3.30 would be automatically downloaded if I install the files in uprgradable-3.30. I would say, try without them and if you feel it's not stable, install them)

> cat upgradable | grep --color=NEVER -i "gnome-bluetooth" >> upgradable-3.30 #version change doesn't seem very for this one, maybe keep it on bionic \
> cat upgradable | grep --color=NEVER -i "gnome-keyring" >> upgradable-3.30 #version change doesn't seem very for this one, maybe keep it on bionic \
> cat upgradable | grep --color=NEVER -i "gnome" >> upgradable-3.30 \
> cat upgradable  | grep --color=NEVER -i "gtk" > upgradable-libs \
> cat upgradable  | grep --color=NEVER -i "glib" >> upgradable-libs \
> cat upgradable  | grep --color=NEVER -i "gir" >> upgradable-libs

each upgradable list should look something like this

  > adwaita-icon-theme/cosmic,cosmic 3.30.0-0ubuntu1 all [upgradable from: 3.28.0-1ubuntu1] \
  > baobab/cosmic 3.30.0-1 amd64 [upgradable from: 3.28.0-1] \
  > cheese/cosmic 3.30.0-0ubuntu1 amd64 [upgradable from: 3.28.0-1ubuntu1] \
  > cheese-common/cosmic,cosmic 3.30.0-0ubuntu1 all [upgradable from: 3.28.0-1ubuntu1] \
  > etc... etc... etc... \

**You should be upgrading a max of 100 to 250 packages out of 1500**

## Step 4

Using sed, reformat the lists made in step 3 to turn this:

> adwaita-icon-theme/cosmic,cosmic 3.30.0-0ubuntu1 all [upgradable from: 3.28.0-1ubuntu1] baobab/cosmic 3.30.0-1 amd64 [upgradable from: 3.28.0-1] cheese/cosmic 3.30.0-0ubuntu1 amd64 [upgradable from: 3.28.0-1ubuntu1] cheese-common/cosmic,cosmic 3.30.0-0ubuntu1 all [upgradable \
> etc...etc.... etc..

into this:

> apt-get install --assume-yes adwaita-icon-theme baobab cheese cheese-common \
> etc... etc... etc..

> cat upgradables-3.30 | sed 's/\[//g'| sed 's/\/cosmic/\[/g'| sed 's/), /\] /g'| sed 's/)/\]/g'| sed -e 's/\[\([^]]*\)\]//g'|sed '/^\s*$/d'|sed "s/^/apt-get install --assume-yes/g" > up-3.30 \

> cat upgradables-wayland             |  sed 's/\[//g'| sed 's/\/cosmic/\[/g'| sed 's/), /\] /g'| sed 's/)/\]/g'| sed -e 's/\[\([^]]*\)\]//g'|sed '/^\s*$/d'|sed "s/^/apt-get install --assume-yes/g" > up-wayland

> #again, xorg is optional for those using it, don't upgrade it if you don't use it. You want to keep as many files as possible on the LTS track. \
> cat upgradables-xorg             |  sed 's/\[//g'| sed 's/\/cosmic/\[/g'| sed 's/), /\] /g'| sed 's/)/\]/g'| sed -e 's/\[\([^]]*\)\]//g'|sed '/^\s*$/d'|sed "s/^/apt-get install --assume-yes/g" > up-xorg

> #same for the libs \
> cat upgradables-libs            |  sed 's/\[//g'| sed 's/\/cosmic/\[/g'| sed 's/), /\] /g'| sed 's/)/\]/g'| sed -e 's/\[\([^]]*\)\]//g'|sed '/^\s*$/d'|sed "s/^/apt-get install --assume-yes/g" > up-libs

make the newly created script executable

> chmod +x up-*

## Step 5

Taking note of the time and date before beginning, I used the results of 4 to update the packages that need updating

> date > upgrade-start

Then:

> ./up-3.30 \
> ./up-wayland \
> #etc...

Install the Yaru themes (they're not included in 18.04 and are need in 3.30) \
> apt-get install yaru-theme-*

As regular user (non-sudo), activate themes via:
> gsettings set org.gnome.desktop.interface gtk-theme 'Yaru' #or 'Yaru.dark' \
> gsettings set org.gnome.desktop.interface cursor-theme 'Yaru' \
> gsettings set org.gnome.desktop.interface icon-theme 'Yaru' \
> gsettings set org.gnome.desktop.sound theme-name 'Yaru'

Or use gnome-tweaks to do it

If you get any errors, run 
> apt-get --fix-broken install

Then record the end time:
> date > upgrade-finished

Reboot your machine
>reboot

## Step 6

The files upgraded in 5 are no longer on the LTS update track. Meaning, when step 1 is undone and an update initiated, the normal bionic packages will update but these ones will always be considered newer. Furthermore, any depends updated or installed in step 5 will be in the same situation. Updating these packages will require the creation of a script that will update them manually.

lets use the apt history log file to figure out what files will need manual updating:
> cp /var/log/apt/history.log ./cosmics-upgrade.log

Do nano cosmics-upgrade.log and delete any entries from before upgrade-start and those that are after upgrade-finished (in step 5)

Now, let's make a script that will manually upgrade our non-lts packages for us:
> echo '#!/bin/bash' > update-cosmics \
> echo 'cp /etc/apt/sources.list.cosmic /etc/apt/sources.list;apt update' >> update-cosmics

The next step will use sed to format the logs into something we can put in our update-cosmics file (same idea as step 4)
> cat cosmics-upgrade.log | sed 's/:amd64 (/\[/g'| sed 's/), /\] /g'| sed 's/)/\]/g'| sed -e 's/\[\([^]]*\)\]//g'|sed "s/End-Date:/# End-Date:/g"|sed "s/Start-Date:/\n\n\n# Start-Date:/g"|sed "s/Commandline: /# Commandline: /g"|sed 's/Install: /\napt-get install /g'|sed 's/Update: /\napt-get install --assume-yes /g'|sed 's/Remove: /\napt-get remove /g'|sed 's/Upgrade: /\napt-get install /g' >> update-cosmics

Finally add the following line to the very end of update-cosmics:
> echo 'cp /etc/apt/sources.list.bionic /etc/apt/sources.list;apt update' >> update-cosmics

Make the script executable and move it to /usr/bin
> chmod +x update-cosmics \
> cp update-cosmics /usr/bin

## Step 7

Undo Step 1 to allow your system to perform updates normally.
> cp /etc/apt/sources.list.bionic /etc/apt/sources.list;apt update

## Step 8

use update-cosmics to temporarilly switch to cosmic repos and update the packages on the cosmic track. you can run it manually or schedule it using cron.

## Step 9: Bonus Round: Ditch Nautilus 3.26

This is a matter of preference: if you don't use desktop icons or if you want to give the desktop icons extension a try, you can get rid of the outdated nautilus 3.26 that ubuntu has forked for the much improved nautilus 3.30. I like 3.30 because it has WAY better touch screen support and because 3.26's implementation of Desktop icons injects a X11 layer (XWayland really) - even if you are running a wayland session. The desktop icons gnome-shell extension only works with 3.30, it is about 80% feature complete but does not inject an X11 layer into your Wayland session.

Nautilus 3.30 can be obtained by downloading the deb files from debian's servers:

> wget http://ftp.us.debian.org/debian/pool/main/n/nautilus/nautilus_3.30.4-1_amd64.deb \
> wget http://ftp.us.debian.org/debian/pool/main/n/nautilus/libnautilus-extension1a_3.30.4-1_amd64.deb \
> wget http://ftp.us.debian.org/debian/pool/main/n/nautilus/nautilus-data_3.30.4-1_all.deb

use dpkg to install them:
> dpkg -i *nautilus*.deb

Future updates to nautilus can be found here and you'll have to manually install them: http://ftp.us.debian.org/debian/pool/main/n/nautilus, click modification date twice to see the latest debs

The desktop icons extension can be found here.

If you decide to stick with the debian 3.30 nautilus, you'll have to remove these 3 packages from the update-cosmics script we generated earlier. You will also have to do:
> apt-mark hold libnautilus-extension1a nautilus-data nautilus

This avoids ubuntu's updater accidently "uprgrading" nautilus from 3.30 back to 3.26 (yes, it actually can't tell that 3.30 is a higher number than 3.26...).

To undo this, you can just do:
> apt-mark unhold libnautilus-extension1a nautilus-data nautilus \
> apt-get install nautilus nautilus-data libnautilus-extension1a
 
And unstill the desktop-icons extension