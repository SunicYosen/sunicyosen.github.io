---
layout: post
title: Zotero Usage
date: 2020-07-15
category: Skills
author: Sun
tags: [Zotero]
summary: 
---

总结近期对Zotero配置技巧

## 坚果云同步

- 坚果云配置

  登录网页端坚果云账号，点击右上角的账号名称 -> 账户信息 -> 安全选项 -> 第三方应用管理 -> 添加应用密码。应用名称我写的zotero，之后会自己生成一个应用密码，可供Zotero使用。

- Zotero使用

  打开zotero,编辑 -> 首选项 -> 同步 -> 文件同步，使用zotero改成WebDAV，然后复制刚才坚果云内第三方应用管理的服务器地址、账户和密码，密码点击下面zotero对应的”显示“复制即可。全部填入后点击下面”Verify Server“按钮。

## Zotfile

[Zotfile](http://zotfile.com/) [Github](https://github.com/jlegewie/zotfile): Advanced PDF management for Zotero

设置: Tools -> ZotFile Preferences

- General Settings -> Location of Files: `Attach stored copy of file(s)`

- Tablet Settings
    
    - Use ZotFile to send and get files from tablet.

    - Location of Files on Tablet:    
        - Base Folder: `/home/sun/File/Paper/zotfile`
        - Subfolder: `Create subfolders from zotero collections`
        - Use additional subfolders defined by: `/%c/%y`
        - Additional Options:
            - Rename files when they ... `[T]`
            - Save copy of annotated file ... `[F]`
            - Automatically extract annotations ... `[T]`

- Renaming Rules

    - Renaming Format:
        - Use zotero to rename `[F]`
        - Format for all Item Types except Patents: \{\%a_\}\{\%y_\}\{\%t\}
        - Format for Patents:  \{\%a_\}\{\%y_\}\{\%t\}

    - Additional Settings:
        - Delimiter between multiple authors: `_`
        - Replace Blanks `[T]`
        - Maximum numver of authors `[2]`
        - Number of authors to display when authors are omitted : `1`

- Advanced Settings: Default

## Zotero Scholar Citations

[Github](https://github.com/beloglazov/zotero-scholar-citations). 安装即可使用。

## PaperShip Zotero WebDAV验证 <span id="rrf1"></span>[[1]](#rf1)

验证不成功时，Papership给出下面的提示：

`cannot very server, please check your server credentials. got 404`

假如Zotero的文件存储在坚果云的Zotero文件夹，即存储路径为`dav.jianguoyun/dav/zotero`，

### 那么解决办法

打开坚果云官网，登录坚果云账号，在zotero文件夹新建空白的lastsync.txt文件，务必注意的是，必须使用坚果云自带的新建文件工具来新建lastsync.txt文件，不能通过手动上传的方式。

## Reference

<span id="rf1"></span> [[1]](#rrf1) https://www.jianshu.com/p/880ab833a0ba 