---
layout: post
title: TVM学习(2)--从例子开始
date: 2019-08-04 16:25
category: 'Deep Learning'
author: Sunic
tags: [TVM]
summary: 
---

安装了TVM的框架后，追寻TVM提供的教程，以[Compile MXNet Models](https://docs.tvm.ai/tutorials/frontend/from_mxnet.html#sphx-glr-tutorials-frontend-from-mxnet-py)为例子，开始TVM的尝试。[[1]](#rf1) <span id="rrf1"></span>

## 1. Prepare

主要包括环境的配置和网络模型的获取。

### 1. Environment

通过编译安装`TVM`库,可参考： [TVM学习(1)--搭建环境](https://sunicyosen.github.io/2019/08/02/TVM-Study-1-Setup-Environment)

首先使用`pip3`安装mxnet的package：

```bash
pip3 install mxnet --user
```

接下来即可在Python中使用`TVM`和`MXNet`了：

```python
# some standard imports
import mxnet as mx
import tvm
import tvm.relay as relay
import numpy as np
```

### 2. Get Model & Data

由于TVM对MXNet原生支持，这里只需要下载预训练好的MXNet模型即可，这里选取了`Resnet18`网络。

1. 从`mxnet.gluon.model_zoo.vision`获取模型

    ```python
    from mxnet.gluon.model_zoo.vision import get_model
    block = get_model('resnet18_v1', pretrained=True)
    ```

    首先通过`mxnet.gluon.model_zoo.vision`包的`get_model`函数获取预编译的`resnet18_v1`模型：

    其分别调用了`mxnet.gluon.model_zoo.model_store.py`的`resnet18_v1()`函数，
    以及`mxnet.gluon.model_zoo.vision.resnet.py`的`get_model_file()`函数获取parameters.

    ```python
    get_model('resnet18_v1', pretrained=True)
    resnet18_v1(pretrained=True)
    get_resnet(1, 18, pretrained=True)
    get_model_file('resnet%d_v%d'%(num_layers, version), root=root)
    # num_layers=18 version=1
    ```

    get_model_file()函数从[https://apache-mxnet.s3-accelerate.dualstack.amazonaws.com/](https://apache-mxnet.s3-accelerate.dualstack.amazonaws.com/)下载相应的文件模型参数文件。

    下载到本地地址为[$HOME/.mxnet/models](file:///$HOME/.mxnet/models)

2. 获取输入Data

    这里我们选择了一张小猫图片，如下图：

    ![Example Cat](/img/2019-08-04-TVM-Study-2-Start-with-example/cat.png){: .center-image}

    输入图片的获取和处理程序如下：

    ```python
    from tvm.contrib.download import download_testdata
    from PIL import Image
    from matplotlib import pyplot as plt

    img_url = 'https://github.com/dmlc/mxnet.js/blob/master/data/cat.png?raw=true'
    img_name = 'cat.png'
    img_path = download_testdata(img_url, 'cat.png', module='data')
    # download from url. Functions:
    # download.py -> download_testdata() ----> download.py -> download()

    image = Image.open(img_path).resize((224, 224))
    # 将图像resize为特定大小[224, 224]

    def transform_image(image):
        # mean = [123., 117., 104.]
        # std = [58.395, 57.12, 57.375]
        # 在ImageNet上训练数据集的mean和std
        # 图片的均值和方差
        image = np.array(image) - np.array([123., 117., 104.])
        image /= np.array([58.395, 57.12, 57.375])
        # 将RGB三维图片转化为numpy数组。
        # 得到的数组为(224,224,3)的格式。

        image = image.transpose((2, 0, 1))
        # 举着转置，(224,224,3) ---> (3,224,224)

        image = image[np.newaxis, :]
        # 添加轴 (3,224,224) ---> (1,3,224,224)

        return image

    x = transform_image(image)
    # print('x', x.shape)
    ```

    这样我们得到的x为[1,3,224,224]维度的ndarray。这个符合NCHW格式标准，也是我们通用的张量格式。

3. 图片分类标签

    ```python
    synset_url = ''.join(['https://gist.githubusercontent.com/zhreshold/',
                          '4d0b62f3d01426887599d4f7ede23ee5/raw/',
                          '596b27d23537e5a1b5751d2b0481ef172f58b539/',
                          'imagenet1000_clsid_to_human.txt'])
    synset_name = 'imagenet1000_clsid_to_human.txt'
    synset_path = download_testdata(synset_url, synset_name, module='data')
    with open(synset_path) as f:
        synset = eval(f.read())
    ```

    图片标签从上述文本的网站上下载，保存为文本格式。

## 2. Compile

将获取的model(`resnet18_v1`)从`mxnet`格式编译为`relay`格式，进一步获取功能函数和权重参数信息。

1. relay读取resnet，并添加层

    里我们使用的是TVM中的Relay IR，这个IR简单来说就是可以读取我们的模型并按照模型的顺序搭建出一个可以执行的计算图出来，当然，我们可以对这个计算图进行一系列优化。(现在TVM主推Relay而不是NNVM，Relay可以称为二代NNVM)。

    ```python
    shape_dict = {'data': x.shape}
    mod, params = relay.frontend.from_mxnet(block, shape_dict)
    # Function in python/tvm/relay/frontend/mxnet.py
    # Convert from MXNet"s model into compatible relay Function.

    ## we want a probability so add a softmax operator
    func = mod["main"]
    func = relay.Function(func.params, relay.nn.softmax(func.body), None, func.type_params,                          func.attrs)
    # 将在mod的relay表达式最后添加
    # nn.softmax(*)
    # 对最后的结果应用softmax
    ```

2. 对应硬件target编译模型

    首先来我们设置Target为`llvm`，也就是部署到CPU端。通过使用`relay.build_config`函数对build的参数设定，
    通过使用`relay.build`函数对其进行编译，获取graph, lib, params.

    ```python
    target = 'llvm'
    with relay.build_config(opt_level=3):
        graph, lib, params = relay.build(func, target, params=params)
    ```

    该步骤获取的结果如下：

    - graph : str -- The json string that can be accepted by graph runtime.
    - lib : tvm.Module -- The module containing necessary libraries.
    - params : dict -- The parameters of the final graph.

## Run

这一步将编译好的`graph`, `lib`, `params`在Traget上执行。

```python
from tvm.contrib import graph_runtime
ctx = tvm.cpu(0)
# 指定TVM Context

dtype = 'float32'
m = graph_runtime.create(graph, lib, ctx)
# 建立运行时， m即为可执行

# set inputs
m.set_input('data', tvm.nd.array(x.astype(dtype)))
m.set_input(**params) #权重信息

# execute
m.run()

# get outputs
tvm_output = m.get_output(0)
top1 = np.argmax(tvm_output.asnumpy()[0])
print('TVM prediction top-1:', top1, synset[top1])
# 将获得的结果的最大值与标签序号对比，获取结果。
```

## Result

TVM结果：

![TVM Result](/img/2019-08-04-TVM-Study-2-Start-with-example/result_tvm.png){: .center-image}

MXNet原始结果：

![TVM Result](/img/2019-08-04-TVM-Study-2-Start-with-example/result_mxnet.png){: .center-image}

可见其结果一致，但时间上差距不大，可能由于网络较为简单，不具有代表性。

## Reference

<span id="rf1"></span> [[1]](#rrf1) Tiqi Chen et., Compile MXNet Models, [OL], [https://docs.tvm.ai/tutorials/frontend/from_mxnet.html#sphx-glr-tutorials-frontend-from-mxnet-py](https://docs.tvm.ai/tutorials/frontend/from_mxnet.html#sphx-glr-tutorials-frontend-from-mxnet-py)

## Update Log

1. Oct 6 2019, Write Complete.  **<Procrastination！！！>**
