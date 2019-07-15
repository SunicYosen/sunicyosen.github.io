---
layout: post
title: TVM -- TVM and Others.
date: 2019-07-08 23:56
categories: TVM
author: Sunic
tags: ['Deep learning Compiler', TVM, TensorFlow XLA, nGraph, DLVM ]
summary: 
---

需要用到深度学习编译框架来适配设计的学习加速器后端，学习了TVM、XLA、nGraph、DLVM等相关的工具，在这里对其作简单的介绍。

## 1. Introduction

目前类似的编译框架以[TVM](https://tvm.ai/)较为流行，主要还包括Google推出的基于TensorFlow的[XLA](https://www.tensorflow.org/xla), Intel推出的[nGraph](https://ngraph.nervanasys.com/)、以及伊利诺伊大学的[DLVM](http://dlvm.org/)项目等。

## 2. TVM

TVM: An Automated End-to-End Optimizing Compiler for Deep Learning. TVM 是由陈天奇团队发布的，应用于CPU、GPU以及专用加速器的深度学习编译框架(Compiler Stack)，是一种将深度学习工作负载部署到硬件的端到端IR（中间表示）堆栈。换一种说法，可以表述为一种把深度学习模型分发到各种硬件设备上的、端到端的解决方案。旨在缩小深度学习框架和后端的硬件设备之间的鸿沟。可以通过框架将深度学习部署到CPU、GPU、专用加速器等，乃至可以部署到比如手机、树莓派等设备。

TVM的主要作用与意义是:

1. 为不同硬件后端的深度学习工作负载提供性能可移植性的框架。
2. 提供新颖的调度原语，它们利用了跨线程内存重用，新颖的硬件内在函数和延迟隐藏
3. 提出并实现了基于机器学习的优化系统，以自动探索和搜索优化的张量运算符
4. 构建了一个端到端的编译和优化堆栈，允许将高级框架（包括TensorFlow，MXNet，PyTorch，Keras，CNTK）中指定的深度学习工作负载部署到各种硬件后端（包括CPU，服务器GPU，移动GPU和基于FPGA的加速器）。

### 2.1 TVM的结构框架

![SystemOverviewofTVM](/img/2019-07-08-TVM-and-Others/System-Overview-of-TVM.png "System overview of TVM"){: .center-image .eighty-percent-image}

## 3. TensorFlow XLA

## 4. nGraph

## 5. DLVM

## Reference

[1]: TVM Group \[OL\], 2019.07.14, [https://tvm.ai/about](https://tvm.ai/about)

[2]: 陈天奇@如何评价陈天奇团队新开源的TVM \[OL\], 2019.07.14, [https://www.zhihu.com/question/64091792](https://www.zhihu.com/question/64091792)

[3]: CHEN T, MOREAU T, JIANG Z, 等. TVM: An Automated End-to-End Optimizing Compiler for Deep Learning[J]. arXiv:1802.04799 [cs], 2018.
