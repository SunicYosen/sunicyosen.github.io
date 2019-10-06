---
layout: post
title: TVM学习(1)--搭建环境
date: 2019-08-02 10:31
category: 'Deep Learning'
author: Sunic
tags: ['TVM']  
summary: 搭建TVM环境
---

学习TVM，从环境搭建开始。TVM的环境搭建包括Share Library的搭建和python环境的配置。主要参考[TVM](https://docs.tvm.ai/install/from_source.html)

## 1. 准备

1. 使用的OS: Ubuntu18.04
2. Clone Git Project

   ```bash
   # Clone project with submodule
   git clone --recursive https://github.com/dmlc/tvm

   # Update
   git submodule update
   git submodule init 
   ```

3. TVM的环境搭建主要有两个步骤：
   - 首先从C ++代码构建共享库（libtvm.so用于linux，libtvm.dylib用于macOS，libtvm.dll用于windows）,本文使用Linux作为开发环境。
   - Python语言包的设置（eg. Python）

## 2. Share Library

这一步的目的是构建共享库：

- 在Linux上, 目标库是`libtvm.so`，`libtvm_topi.so`
- 在macOS上，目标库是`libtvm.dylib`，`libtvm_topi.dylib`
- 在Windows上，目标库是`libtvm.dll`，`libtvm_topi.dll`

1. 安装依赖库

   ```bash
   sudo apt-get update
   sudo apt-get install -y python python-dev python-setuptools gcc libtinfo-dev zlib1g-dev build-essential cmake
   ```

   相关的要求如下：

   - C++编译器支持C++11标准 (>= g++4.8)
   - cmake >= 3.5
   - llvm >= 4(如果编译特定的Function)
   - 如果只是有Cuda/OpenCL，则可以在没有LLVM依赖关系的情况下构建。
   - TVM如果想使用NNVM编译器，则需要LLVM.

2. CMAKE

   使用cmake来构建库。可以通过config.cmake修改TVM的配置。

   首先在tvm根目录下创建build目录，并将config.cmake复制到build目录下。

   ```bash
   cd $TVM
   mkdir build
   cp cmake/config.cmake build
   ```

   可以通过修改cmake.config内容配置编译。

   使用的PC上无法支持Cuda，因此我们需要`set(USE_CUDA OFF)`， 如果需要使用Cuda，那么可以`set(USE_CUDA ON)`. 其他的配置也是如此，(eg. OpenCL, RCOM, METAL, VULKAN, …).

   具体配置变量如下：
   编辑build/config.cmake文件，里面有一些功能开关，这些配置有：

   ```cmake
    USE_CUDA # NVIDIA的GPU计算；
    USE_ROCM # 通用的GPU计算，AMD提出，目的很显然...；
    USE_SDACCEL # FPGA计算；
    USE_AOCL # Intel FPGA SDK for OpenCL (AOCL) runtime；
    USE_OPENCL # 异构平台编写程序的框架，异构平台可由CPU、GPU、DSP、FPGA或其他类型的处理器与硬件加速器所组成；
    USE_METAL # iOS上的GPU计算；
    USE_VULKAN # 新一代的openGL，Android 7.x开始支持（iOS不支持，因为有自己的metal2）；
    USE_OPENGL # 2D/3D渲染库标准，显卡厂家负责实现和支持；
    USE_SGX # Intel SGX ; 
    USE_RPC # 远程调用，电脑和手机可以通过网络联调；
    USE_STACKVM_RUNTIME # embed stackvm into the runtime；
    USE_GRAPH_RUNTIME # enable tiny embedded graph runtime；
    USE_GRAPH_RUNTIME_DEBUG # enable additional graph debug functions；
    USE_LLVM # llvm support；
    USE_BLAS # API标准，规范发布基础线性代数操作的数值库（如矢量或矩阵乘法），不同的实现有openblas, mkl, atlas, apple
    USE_RANDOM # contrib.random运行时；
    USE_NNPACK #
    USE_CUDNN # CUDNN
    USE_CUBLAS #
    USE_MIOPEN #
    USE_MPS #
    USE_ROCBLAS #
    USE_SORT # 使用contrib sort；
    USE_ANTLR #
    USE_VTA_TSIM， # VTA
    USE_RELAY_DEBUG # Relay debug模式
    ```

3. LLVM配置

   CPU的Codegen需要通过LLVM实现。因此需要配置LLVM.要求如下：
   - \>= 4.0
   - 在Ubuntu下可以直接通过apt,安装：

     ```bash
     sudo apt install llvm-8 llvm-8-dev llvm-8-runtime
     ```

   - 在`build/cmake.config`中设置：`set(USE_LLVM /path/to/your/llvm/bin/llvm-config)`,比如：`set(USE_LLVM /usr/lib/llvm-8/bin/llvm-config)`

4. 编译

   做好上面的配置，可是编译了，如下：

   ```bash
   cd build
   # cmake -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON
   ## for verbose, by civilnet
   cmake ..
   make -j4
   ```

   最终链接出以下so库：
   - `libvta_tsim.so`
   - `libvta_fsim.so`
   - `libtvm_runtime.so`
   - `libtvm.so`
   - `libtvm_topi.so`
   - `libnnvm_compiler.so`
   - `libvta_hw.so`

   具体如下：<span id="rrf1"></span>[[1]](#rf1)

   1. `libvta_tsim.so`

      VTA--Versatile Tensor Accelerator，参考[VTA](https://docs.tvm.ai/vta/index.html)，该库为其Cycle级仿真库，由以下这几个编译单元生成:

      ```bash
      vta/src/device_api.cc
      vta/src/runtime.cc
      vta/src/tsim/tsim_driver.cc
      vta/src/dpi/module.cc
      ```

   2. `libvta_fsim.so`

      该库为其快速仿真库，由以下这几个编译单元生成:

      ```bash
      vta/src/device_api.cc
      vta/src/runtime.cc
      vta/src/sim/sim_driver.cc
      ```

   3. `libtvm_runtime.so`

      顾名思义，tvm的运行时，实际上，这个库是TVM运行时的一个最小化库，由“Minimum runtime related codes”编译而成——也即下面的这些源文件：

      ```bash
      src/runtime/builtin_fp16.cc
      src/runtime/c_dsl_api.cc
      src/runtime/c_runtime_api.cc
      src/runtime/cpu_device_api.cc
      src/runtime/dso_module.cc
      src/runtime/file_util.cc
      src/runtime/module.cc
      src/runtime/module_util.cc
      src/runtime/ndarray.cc
      src/runtime/registry.cc
      src/runtime/system_lib_module.cc
      src/runtime/thread_pool.cc
      src/runtime/threading_backend.cc
      src/runtime/vm/memory_manager.cc
      src/runtime/vm/object.cc
      src/runtime/vm/vm.cc
      src/runtime/workspace_pool.cc
      3rdparty/bfloat16/bfloat16.cc
      src/runtime/rpc/*.cc
      src/runtime/graph/graph_runtime.cc
      src/contrib/sort/sort.cc
      ```

   4. `libtvm.so`

      完整的tvm，由编译时、运行时、rpc部分等组成：
      - **`common`**: Internal common utilities.
      - **`api`**: API function registration.
      - **`lang`**: The definition of DSL related data structure.
      - **`arithmetic`**: Arithmetic expression and set simplification.
      - **`op`**: The detail implementations about each operation(compute, scan, placeholder).
      - **`schedule`**: The operations on the schedule graph before converting to IR.
      - **`pass`**: The optimization pass on the IR structure.
      - **`codegen`**: The code generator.
      - **`runtime`**: Minimum runtime related codes.
      - **`autotvm`**: The auto-tuning module.
      - **`relay`**: Implementation of Relay. The second generation of NNVM, a new IR for deep learning frameworks.
      - **`contrib`**: Contrib extension libraries.

      这个库比较大，有200多个编译单元：

      ```bash
      src/api/*.cc
      src/arithmetic/*.cc
      src/autotvm/*.cc
      src/codegen/*.cc
      src/lang/*.cc
      src/op/*.cc
      src/pass/*.cc
      src/schedule/*.cc
      src/relay/backend/*.cc
      src/relay/ir/*.cc
      src/relay/op/*.cc
      src/relay/pass/*.cc
      3rdparty/HalideIR/src/*.cpp
      src/runtime/stackvm/*.cc
      src/codegen/opt/*.cc
      src/codegen/llvm/*.cc
      src/runtime/*.cc
      src/contrib/hybrid/codegen_hybrid.cc
      3rdparty/bfloat16/bfloat16.cc
      src/contrib/sort/sort.cc
      ```

   5. `libtvm_topi.so`

      TOPI（TVM OP Inventory），is the operator collection library for TVM intended at sharing the effort of crafting and optimizing tvm generated kernels。由下面的编译单元生成：

      ```bash
      topi/src/topi.cc
      ```

   6. `libnnvm_compiler.so`

      NNVM编译器，由以下编译单元生成：

      ```bash
      nnvm/src/c_api/*.cc
      nnvm/src/compiler/*.cc
      nnvm/src/core/*.cc
      nnvm/src/pass/*.cc
      nnvm/src/top/nn/*.cc
      nnvm/src/top/tensor/*.cc
      nnvm/src/top/vision/nms.cc
      nnvm/src/top/vision/ssd/mutibox_op.cc
      nnvm/src/top/vision/yolo/reorg.cc
      nnvm/src/top/image/resize.cc
      ```

   7. `libvta_hw.so`

      在使用vta的TSIM仿真器时，需要通过使用hardware-chisel编译的硬件动态链接库`libvta_hw.so`。其具体的编译流程如下:

      首先进入$TVM_HOME/vta/hardware/chisel下，在Makefile文件中添加编译参数`-fPIC`如下：

      `cxx_flags += -fPIC`

      </span id="rrf2"></span>
      `-fPIC`: The `f` is the gcc prefix for options that "control the interface conventions used in code generation". The `PIC` stands for "Position Independent Code", it is a specialization of the fpic for m68K and SPARC.[[2]](#rf2)

      然后，通过make编译即可。

      添加编译参数的目的是避免如下错误.

      <span id="rrf3"></span>[[3]](#rf3)
      `relocation R_X86_64_32 against '.rodata' can not be used when making a shared object;`

## 3. Python环境

Python环境搭建比较容易，只需要添加Python库的PATH,如下：

```bash
export TVM_HOME=/home/gemfield/github/Gemfield/tvm/
export PYTHONPATH=$TVM_HOME/python:$TVM_HOME/topi/python:$TVM_HOME/nnvm/python:${PYTHONPATH}
```

值得注意的是，TVM放弃了对Python2的支持，需要Python>=3.5.

安装python依赖:

- Necessary dependencies:

   ```bash
   pip3 install --user numpy decorator attrs
   ```

- If you want to use RPC Tracker

   ```bash
   pip3 install --user tornado
   ```

- If you want to use auto-tuning module

   ```bash
   pip3 install --user tornado psutil xgboost
   ```

- If you want to parse Relay text format progams, you must use Python 3 and run the following

   ```bash
   pip3 install --user mypy orderedset antlr4-python3-runtime
   ```

- 安装onnx

   ```bash
   pip3 install onnx
   ```

## Reference

<span id="rf1"></span>[[1]](#rrf1) Gemfield, PyTorch转TVM, [OL], 2019-08-04 [https://zhuanlan.zhihu.com/p/58995914](https://zhuanlan.zhihu.com/p/58995914)

<span id="rf2"></span>[[2]](#rrf2) What does -fPIC mean when building a shared library? [OL], [https://stackoverflow.com/questions/966960/what-does-fpic-mean-when-building-a-shared-library](https://stackoverflow.com/questions/966960/what-does-fpic-mean-when-building-a-shared-library)

<span id="rf3"></span>[[3]](#rrf3)[OL], [https://blog.csdn.net/u010312436/article/details/52486811](https://blog.csdn.net/u010312436/article/details/52486811)

## 更新日志

1. 2019.08.27: 代码更新`libvta_tsim.so`和`libvta_fsim.so`.
2. 2019.08.28: 添加`libvta_hw.so`说明.
3. 2019.08.01: 添加`-fPIC`说明。
