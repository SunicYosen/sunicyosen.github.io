---
layout:     post
title:      Markdown Usage for Jekyll
date:       2019-07-06 09:32 +0800
categories: Skills
author:     Sunic 
tags:       Study Markdown Jekyll
summary:    In this blog, some of usage of markdown for jekyll are introduced.
---

搭建Github Page based on Jekyll， 使用了Markdown的语法。

Markdown的优点如下：

1. 纯文本，所以兼容性极强，可以用所有文本编辑器打开;
2. 让你专注于文字而不是排版;
3. 格式转换方便，Markdown 的文本你可以轻松转换为 html、电子书等;
4. Markdown 的标记语法有极好的可读性;

## 1. 标题 Headers

在 Markdown 中，你只需要在文本前面加上`#`即可设置为标题，在Markdown中，包含了一级标题、二级标题、三级标题、四级标题、五级标题和六级标题，总共六级，只需要增加`#`即可，标题字号相应降低。注意，在`#`和内容前最好使用空格。

```markdown
# 一级标题
## 二级标题
...
###### 六级标题
```

----

## 2. 强调 Emphasis

强调是通过在文字两侧加入星号（`*`）、下划线（`_`）和波浪线（`~`）等符号实现的，注意符号和需要强调的文字之间没有空格

```markdown
*This text will be italic*
_This will also be italic_（斜体）  
**This text will be bold**（黑体）  
__This will also be bold__（黑体）  
***This will be bold & italic***(黑斜体)  
___This will also be bold & italic___(黑斜体)  
~~This text will be deleted~~（删除线）  
_You **can** combine them_（可以多种格式复合使用）
```

*This text will be italic*(斜体)  
_This will also be italic_(斜体)  
**This text will be bold**(黑体)  
__This will also be bold__(黑体)  
***This will be bold & italic***(黑斜体)  
___This will also be bold & italic___(黑斜体)  
~~This text will be deleted~~（删除线）  
_You **can** combine them_（可以多种格式复合使用）  

----

## 3. 换行 New Line

在Markdown中，使用在行末尾两个空格来换行。  
Use two trailing spaces on the right to create linebreak tags.

----

## 4. 列表 List

列表格式也很常用，在Markdown中，包含无需列表和有序列表。

### 4.1 无序列表

你只需要在文字前面加上`-` `*` `+`就可以了，但同一篇文章中推荐使用同一种. 例如:

`-`

```markdown
- 列表1
  - 子列表
- 列表1
  - 子列表
```

效果：

- 列表1
  - 子列表
- 列表1
  - 子列表

`*`

```markdown
* 列表2
* 列表2
```

效果：

* 列表2
* 列表2

`+`

```markdown
+ 列表3
+ 列表3
```

效果：

+ 列表3
+ 列表3
  
### 4.2 有序列表

如果你希望有序列表，也可以在文字前面加上 `1.` `2.` `3.`等就可以了，例如：

```markdown
1. 列表1
  1. 子列表
  2. 子列表
2. 列表2
3. 列表3
```

效果：  

1. 列表1
   1. 子列表
   2. 子列表
2. 列表2
3. 列表3

----

## 5. 链接 Link

Markdown中主要包括网页链接和图片等链接。

### 5.1 网页链接

在 Markdown 中，插入链接不需要其他按钮，你只需要使用 `[显示文本](链接地址)` 这样的语法即可，例如：

```markdown
[Sunic Github](https://www.github.com/sunicyosen)
```

Github链接: [Sunic Github](https://www.github.com/sunicyosen)

### 5.2 图片链接

在 Markdown 中，插入图片不需要其他按钮，你只需要使用这样`![](图片链接地址)` 的语法即可，例如：

```markdown
![LOGO](/assets/res/logo.png "LOGO for Sunic")
```

这样添加的图片为靠左的，效果如下图所示：

![LOGO](/assets/res/logo.png "LOGO for Sunic")

#### 5.2.1 图片居中

在Jekyll中，我们可以使用CSS的格式，将Markdown中的图片居中。首先，我们定义.center-image的CSS属性：

```css
.center-image
{
    margin: 0 auto;
    display: block;
}
```

或者sass：

```sass
.center-image
    margin: 0 auto
    display: block
```

定义属性ID后，在Markdown中，我们可以通过如下的方式使用：

```markdown
![Picture description](/link/to/picture.jpg){: .center-image }
```

如果需要多个属性，可添加多个ID：

```markdown
![Picture text](/link/to/picture.jpg){: .center-image .example-class1 .example-class2 }
```

对于上图，可以居中，其语法如下：

```markdown
![LOGO](/assets/res/logo.png "LOGO for Sunic"){: .center-image }
```

效果图如下：

![LOGO](/assets/res/logo.png "LOGO for Sunic"){: .center-image }

通过类似的方法，我们可以调整其他属性。

<span id="rr1"></span>

本小节参考[[1]](#r1).

----

## 6. 引用 Quotation

在我们写作的时候经常需要引用他人的文字，这个时候引用这个格式就很有必要了，在 Markdown 中，你只需要在你希望引用的文字前面加上 `>` 就好了，例如：

> 既然选择了远方，便只顾风雨兼程。

引用诗句：

> 窗前明月光，  
> 疑是地上霜。  
> 举头望明月，  
> 低头思故乡。  

----

## 7. 代码引用 Code

需要引用代码时，如果引用的语句只有一段，不分行，可以用'`'将语句包起来。例如：

`hello world`

如果引用的语句为多行，可以将'```'置于这段代码的首行和末行。例如：

``` c
#include "stdio.h"

int main()
{
  printf("Hello world! \n");
}
```

----

## 8. 表格 Table

例如：

```markdown
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

显示如下：

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

----

## 9. 分割线 Dividing line

Markdown中使用3个以上的`-`或者`*`插入分割线。同一篇文章中推荐使用同一种。
eg:

```markdown
----
```

效果：

----

```markdown
****
```

效果：

****

## 10. 公式 Equations

公式的编辑采用Latex语法。

行内公式：
`$$E=mc^2$$`

效果: $$E=mc^2$$

公式块：

```markdown
$$
e^{i\theta} = \cos \theta +i\sin \theta
$$

$$
e^z = 1 + \frac{z}{1!} + \frac{z^2}{2!} + \frac{z^3}{3!} + \cdots = \sum_{n=0}^{\infty}\frac{z^n}{n!}
$$
```

$$
e^{i\theta} = \cos \theta +i\sin \theta
$$

$$
e^z = 1 + \frac{z}{1!} + \frac{z^2}{2!} + \frac{z^3}{3!} + \cdots = \sum_{n=0}^{\infty}\frac{z^n}{n!}
$$

### 10.1 Github Page 数学公式的渲染

Github page 不支持Markdown的原生的数学公式，需要借助其他工具，外挂Javascript的方案支持跨浏览器的内容渲染。参考[在 Github.Page渲染数学公式](https://wanguolin.github.io/mathmatics_rending/)

在需要的html增加这样一句话：

```javascript
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
```

现在可以在`$$`和`$$`之间书写数学公式的语法了。注意，这里都使用`$$`.

<span id="rr2"></span>

本小节参考[[2]](#r2).

## 11. 转义字符 Backslash

如果想要插入以上内容中用到的一些符号（字面上，而非功能性应用），比如希望插入星号`*`，但不是用这个星号来表示斜体、加粗、列表等，那么可以在符号前面加反斜线`\`以插入这些普通符号。

```markdown
\\ 反斜线
\` 反引号
\* 星号
\_ 底线
\{\} 花括号
\[\] 方括号
\(\) 括弧
\# 井字号
\+ 加号
\- 减号
\. 英文句点
\! 惊叹号
```

效果：  

\\ 反斜线  
\` 反引号  
\* 星号  
\_ 底线  
\{\} 花括号  
\[\] 方括号  
\(\) 括弧  
\# 井字号  
\+ 加号  
\- 减号  
\. 英文句点  
\! 惊叹号  

## 12. 脚注 Reference

在文中使用\[^1\]的方式标记脚注，在文末使用\[^1\]:加入参考文献，注意要使用英文冒号，后面有无空格均可。

也可以使用引用的方式。eg:

```markdwon
Github Website: [Github][Github]

[Github]: https://www.github.com "Github Web"
```

效果：

Github Website: [Github][Github]

[Github]: https://www.github.com "Github Web"

### 12.1 参考文献页内跳转

探索了一段时间的Markdown的参考文献, 没找到很好的实现方式，这里给出一个繁琐的实现。

在参考文献的章节部分，使用:

```html
<span id="id_name"></span>
```

定义ID, 这样保证在其他地方可以地位到这个地方。

在文中，使用链接的方式:

```markdown
[[1]](#id_name)
```

这样就可以实现参考文献的跳转。

如：

```markdown
<span id="rr3"></span> 本小节参考[[3]](#r3).
```

Reference 如下：

```markdown
<span id="r3"></span>

[[3]](#rr3): MarkDown页内跳转实现 [OL], 2019-07-15, [https://www.jianshu.com/p/0c5d6678ed6d](https://www.jianshu.com/p/0c5d6678ed6d)
```

效果如下：

<span id="rr3"></span>

本小节参考[[3]](#r3).

## Reference

<span id="r1"></span>

[[1]](#rr1): Centering Images with Jekyll and Markdown [OL], 2019-07-15, [https://thornelabs.blog/posts/centering-images-with-jekyll-and-markdown.html](https://thornelabs.blog/posts/centering-images-with-jekyll-and-markdown.html)

<span id="r2"></span>

[[2]](#rr2): 在 Github.Page渲染数学公式 [OL], 2019-07-15, [https://wanguolin.github.io/mathmatics_rending/](https://wanguolin.github.io/mathmatics_rending/)

<span id="r3"></span>

[[3]](#rr3): MarkDown页内跳转实现 [OL], 2019-07-15, [https://www.jianshu.com/p/0c5d6678ed6d](https://www.jianshu.com/p/0c5d6678ed6d)
