---
layout: post
title: Design Compiler Usage
date: 2019-07-23 13:20
category: IC
author: Sunic
tags: ['Design Compiler', Synopsys, RTL]
summary: 
---

学习IC设计使用到了DC(Design Compiler), 对其中的使用方法等作学习笔记。

## 1 Introduction

Design Compiler的作用是将RTL级代码转化为门级网表，为后续的时序分析和后仿做准备，其过程主要包括translation、optimization和mapping。DC的实现有两种方式，一种是命令行或脚本的方式，另外一种是图形界面方式。

DC综合需要库的支持，一般我们使用的库为.db的二进制文件。库分为三个等级：

1. target library是指RTL级的HDL描述到门级时所需的标准单元综合库，它是由芯片制造商（Foundry）提供的，包含了物理信息的单元模型。
2. link library可以是同target_library一样的单元库，也可以是已经底层已经被综合到门级的模块，在由下而上的综合过程中，上一层的设计调用底层已综合模块时，将从link_library中寻找并链接起来。
3. symbol library是显示电路时，用于标识器件、单元的库。芯片供应商提供的库通常有max,type,min三种类型，代表操作环境为最坏(worst)，典型(type)，最好(best)三种情况，当然也有其他形式的库如fast.db、slow.db等。

本文主要参考<span id="rrf1"></span>[[1]](#rf1).

### 1.1 实验平台

Ubuntu18.04 with DC L-2016.03-SP1 for linux64

## 2 DC综合流程

高层次设计的流程图如下：
![高层次设计的流程图](/img/2019-07-23-Design-Compiler-Usage/Process-of-HL-Design.png "高层次设计的流程图"){: .center-image .eighty-percent-image}

1. 在设计之前，准备好库、HDL代码的思想、约束生成；然后根据设计思想用 RTL 源码详细地、完整地为设计建立模型、定义设计中寄存器结构和数目、定义设计中的组合电路功能、定义设计中寄存器时钟等等的设计规格和实现。
2. 完成 RTL 源码设计之后,应让设计开发与功能仿真并行进行:
   - 在设计开发阶段,我们使用 DC 来实现特定的设计目标(设计规则和优化约束),以及执行默认选项的初步综合.
   - 如果设计开发结果未能在 10%的偏差范围内满足时序目标,则需要修正 HDL 代码,然后重复设计开发和功能验证的过程
   - 在功能仿真中,通过特定的工具来确定设计是否能按如所需的功能工作.
   - 如果设计未能满足功能要求,  我们必须修改设计代码以及重复设计开发和功能仿真，继续设计开发和功能仿真直至设计功能正确及满足小于 10%偏差的时序目标.
3. 使用 DC 完成设计的综合并满足设计目标.这个过程包括三个步骤，即综合=转化+逻辑优化+映射，首先将 RTL 源代码转化为通用的布尔等式，然后设计的约束对电路进行逻辑综合和优化，使电路能满足设计的目标或者约束，最后使用目标工艺库的逻辑单元映射成门级网表，在将设计综合成门级网表之后,要验证此时的设计是否满足设计目标.如果不能满足设计目标,此时需要产生及分析报告确定问题及解决问题
4. 当设计满足功能、时序以及其他的设计目标的时候,需要执行物理层设计最后分析物理层设计的性能，也就是使用DC的拓扑模式，加入floorplan的物理信息后进行综合分析设计的性能。如果结果未能满足设计目标,应返回第三步.如果满足设计目标,则本部分设计周期完成.

工具与设计流程的对应关系如下图所示：

![工具与设计流程的对应关系](/img/2019-07-23-Design-Compiler-Usage/DC-In-HL-Design.png "工具与设计流程的对应关系"){: .center-image .eighty-percent-image}

这个图将上面的设计流程图细化，着重与DC的部分，描述了使用DC进行逻辑综合时要做的事，同时，也是对前面的流程图解说的图形概述。在综合的时候，首先DC的HDL compiler把HDL代码转化成DC自带的GTECH格式，然后DC的library compiler 根据标准设计约束（SDC）文件、IP-DW库、工艺库、图形库、（使用拓扑模式时，还要加入ICC生成的DEF模式，加载物理布局信息）进行时序优化、数据通路优化、功耗优化（DC的power compiler进行）、测试的综合优化（DC的DFT compiler），最后得到优化后的网表。

使用DC进行基本的逻辑综合的流程图与相应的命令如下：

![DC Process](/img/2019-07-23-Design-Compiler-Usage/Process-of-DC.png "DC Process"){: .center-image .eighty-percent-image}

这个图给出了使用DC进行逻辑综合时的基本步骤，我们根据这个图运行DC。流程如下：

1. 准备设计文件，DC 的设计输入文件一般为 HDL 文件。

2. 指定库文件，需要指定的库文件包括：
   1. 链接库（link library）
   2. 目标库（target library）
   3. 符号库（symbol library）
   4. 综合库（synthetic library）

   下面是库的解释，具体的解释在后面有说，这里先进行简单地概述一下：
   1. Link library & target library
      Link library和target library统称为technology library（即工艺库，习惯称之为综合库）technology library 由半导体制造商提供，包含相关cell的信息及设计约束标准，其中：
      - Target library: 在门级优化及映射的时候提供生成网表的cell,即DC用于创建实际电路的库;
      - Link library: 提供设计网表中的cell，可以跟target_library使用同一个库，但是DC不用link library中的cell来综合设计。
   当 DC 读入设计时，它自动读入由 link library 变量指定的库。当连接设计时，DC 先搜寻其内存中已经有的库，然后在搜寻由 link  library 指定的库。
   注：当读入的文件是门级网表时，需要把 link library 指向生成该门级网表的库文件，否则 DC 因不知道网表中门单元电路的功能而报错。 关于工艺库里面的具体内容，后面会专门进行说明。

   2. Symbol library
   Symbol library 提供 Design Vision GUI 中设计实现的图形符号，如果你使用脚本模式而不使用 GUI,此库可不指定 Symbol library

   3. Synthetic library
   为 Designware library,名字上翻译是综合库，但却常称之为IP库，而不是直译。特殊的Designware library是需要授权的（比如使用多级流水线的乘法器），默认的标准Designware由DC软件商提供，无需指定。

   4. Create_mw_lib :主要使用DC的物理综合的时候，需要生成物理库

3. 读入设计 ：

   设计的读入过程是将设计文件载入内存，并将其转换为DC的中间格式，即GTECH格式，GTECH 格式由`soft macros`如adders, comparators等组成，这些组件来自synopsys的synthetic lib，每种组件具有多种结构。

   读入设计有两种实现方法实现方法：`read`和`analyze`&`elaborate`（实际上`read`是`analyze`与`elaborate`的打包操作），下面介绍二者在使用中的区别：

   | Item                | `analyze`&`elaborate` |           `read`               |
   |:-------------------:|:---------------------:|:------------------------------:|
   | Style               | Verilog / VHDL        | Verilog / VHDL / EDIF / DB et. |
   | Usage               | 综合Verilog/VHDL的RTL设计 | 读网表，设计预编译 |
   | Design Libs         | 用`-library`定义库名，存储`.syn`文件 | 用缺省的设置，不能存储中间结果 |
   | Generics(VHDL)      | ENABLE | DISABLE |
   | Architecture(VHDL)  | ENABLE | DISABLE |

   从中可以看到，`analyze & elaborate`可以自由指定设计库，并生成GTECH中间文件前生成`.syn`文件存储于work目录下，便于下次`elaborate`节省时间，我们一般选择`analyze & elaborate`的方法读入设计。

4. 定义设计环境：

   定义对象包括工艺参数（温度、电压等），I/O 端口属性（负载、驱动、扇出），统计wire-load模型，设计环境将影响设计综合及优化结果。

5. 设置设计约束：

   设计约束包括设计规则约束和优化约束，设计规则约束（design rule constraint）由工艺库决定，在设计编译过程中必须满足，用于使电路能按功能要求正常工作。设计优化约束定义了 DC 要达到的时序和面积优化目标，该约束由用户指定，DC 在不违反设计规则约束的前提下，遵循此约束综合设计。

6. 选择编译策略：

   对于层次化设计，DC中有两种编译策略供选择，分别为`top down`和`bottom up`。在`top down`策略中，顶层设计和子设计在一起编译，所有的环境和约束设置针对顶层设计，虽然此种策略自动考虑到相关的内部设计，但是此种策略不适合与大型设计，因为`top down`编译策略中，所以设计必须同时驻内存，硬件资源耗费大。在`bottom up`策略中，子设计单独约束，当子设计成功编译后，被设置为`dont_touch`属性，防止在之后的编译过程中被修改，所有同层子设计编译完成后，再编译之上的父设计，直至顶层设计编译完成。`Bottom up`策略允许大规模设计，因为该策略不需要所有设计同时驻入内存。

7. 编译：

   用`Compile`命令执行综合与优化过程，还可以利用一些选项指导编译和优化过程。

8. 分析及解决设计中存在的问题

   DC可以产生一些报告以反应设计的综合和优化结果，如：时序、面积、约束等报告，这些报告有助于分析和解决设计中存在的问题以改善综合结果，我们还可以利用`check_design`命令检验综合的设计的一致性。

9. 存储设计数据

   DC不会自动存储综合后的设计结果，因而需要在离开 DC 时手动存储设计数据。比如存储网表、延时信息等数据文件。

## 2.常用命令

按照如下的框图对相关的命令举例：<span id="rrf2"></span>[[2]](#rf2)

![DC Command Structure](/img/2019-07-23-Design-Compiler-Usage/DC-Command-Structure.png "DC Command Structure"){: .center-image .eighty-percent-image}

### 2.1 tcl的命令和结构

1. 设置变量命令：

   ```tcl
   set PER 2.0
   ```

2. 显示变量命令：

   ```tcl
   echo $PER  
   # Result: 2.0
   ```

3. 表达式操作：

   ```tcl
   set MARG  0.95
   expr  $PER  *  $MARG
   # expr: *, /, +, >, <, =, <=, >=
   set PCI_PORTS  [get_ports  A]
   set PCLPORTS   [get_ports "Y??M Z*"]
   ```

4. 命令嵌套，显示命令中嵌套表达式命令：

   ```tcl
   echo "Effctv P = [expr  $PERIOD * $MARGIN]"
   # Result with soft quotes: "Effctv P = 1.9"
   ```

   等价于：

   ```tcl
   echo {Effctv P = [expr $PERIOD * $MARGIN]}
   # Result with hard quotes:
   # "Effctv P = [expr $PERIOD * $MARGIN]"
   ```

5. tcl的注释行：# Tcl Comment line

   ```tcl
   set COMMENT injine ; # Tel inline comment
   ```

6. 设置tcl中的列表变量：

   ```tcl
   set MY_DESIGNS "A.v  B.v  Top.v"
   ```

7. 查看列表变量：

   ```tcl
   foreach  DESIGN  $MY_DESIGNS {
      read_verilog  $DESIGN
   }
   ```

8. for循环：

   ```tcl
   for  { set i 1}  { $i  < 10 }  { incr  i} {
      read_verilog  BLOCK_$i.v
   }
   ```

### 2.2 获取帮助

在dc_shell中能用的命令：

- `pwd`
- `cd`
- `Is`
- `history`
- `!l`
- `!7`
- `Ireport`
- `sh`  <LINUX_command> ：加上sh后，可以行在linux中执行的命令，如sh  gvim  xxx.v   (&是后台运行)
- `printenv`
- `get_linux_variable  <LINUX_variable>`

在dc_shell中寻求帮助的命令

下面的这些man、printvar命令都只能在dc_shell中运行：

- `help -verbose *clock`: 列出与*clock有关的选项
- `create_clock -help`: 查看create_clock这个命令的简单用法
- `man create_clock`: 查看create_clock这个命令的详细信
- `printvar Mibrary` ：查看 Mibrary这个变量的内容
- `man target_library` ：查看target_library这个命令的详细信息

linux关联DC中的帮助，获取更多的帮助

为了能够在linux中使用dc_shell中的man命令，或者说能在linux中查看某些dc的命令，可以使用关联（alias）。如：

```sh
alias  dcman "/usr/bin/man  -M  $SYNOPSYS/doc/syn/man"
```

然后我们就可以使用dcman来参看dc中的命令了，例如：

```tcl
dcman  targetjibrary
```

### 2.3 tcl语法的检查

当在DC可以执行tcl文件，在运行之前，我们要检查这个tcl文件是否有语法错误，可以使用下面的命令：

```tcl
dcprocheck  xxx.tcl
```

Then

```tcl
source xxx.tcl
```

### 2.4 设计对象的操作

关于设计对象的内容（比如上面是设计对象等），请查看前面的章节，这里我们只进行说对设计对象操作的一些命令（这些命令可以在dc_shell 中执行，或者写在tcl文件中）。

1. 获取设计对象

   ```tcl
   get_ports
   get_pins
   get_designs
   get_cells
   get_nets
   get_clocks
   get_nets
   -of_objects
   [get_pins  FF1_reg/Q]
   get_libs <lib_name>
   get_lib_cells  <lib_name/cell_names>
   get_lib_pins <lib_name/cell_name/pin_names>
   ```

2. 设计对象（的集合）：

   设计对象的物集，总之就是多个设计对象（组成一个集合）

   ```tcl
   all_inputs
   all_outputs
   all_clocks
   all_registers
   all_connected
   all_fanin
   all_fanout
   all_ideal_nets
   ```

3. 对设计对象的操作：

   获取设计对象（get_ports pci_*）后赋予给变量PCI__PORTS：

   ```tcl
   set  PCI__PORTS  [get_ports pci_*]
   echo $PCI__PORTS # -≫ _sel184
   ```

　　查询设计对象：

   ```tcl
   query_objects  $PCI__PORTS  
   # -> {pci_1 pci_2 ...}
   ```

　　获取设计对象的名字：

   ```tcl
　　get_object_name  $PCIMPORTS
   # -> pci_1  pci_2 ...
   ```

　　获取设计对象物集的大小：

   ```tcl
   sizeof_collection  $PCI_PORTS
   # -> 37
   ```

　　往设计对象物集里面增加设计对象：

   ```tcl
   set PCI_PORTS [add_to_collection  $PCI_PORTS  [get_ports CTRL*]]
   ```

　　从设计对象物集里面减少设计对象：

   ```tcl
   set ALL_INP_EXC_CLK  [remove_from_collection  [alljnputs][get_ports CLK]]
   ```

　　比较设计对象：

   ```tcl
   compare_collections
   ```

　　设计对象的索引：

   ```tcl
   index_collection
   ```

　　分类设计对象：

   ```tcl
   sort_collection
   ```

　　循环查看（进行遍历）设计对象物集的内容：

   ```tcl
   foreach_in_collection  my_cells  [get_cells  -hier  *     -filter "is_hierarchical == true"] {
      echo "Instance [get_object_name $cell] is hierarchical"
   }
   ```

　　过滤运算符：

   ```tcl
   # Filtering operators: ==, !=, >, <, >=, <=, =~, h
   filter_collection [get_cells *]  "ref_name AN*"
   get_cells * -filter "dontjouch == true"
   get_clocks * -filter "period < 10"
   ```

　　列出所有单元属性并将输出重定向到文件:

   ```tcl
   # List all cell attributes and redirect output to a file
   redirect -file cell_attr {list_attributes -application -class cell}
   ```

　　Grep以dont_为开头的单元属性文件：

   ```tcl
   # Grep the file for cell attributes starting with dont_
   $grep dont_ cell__attr | more
   ```

　　列出属性为dont_touch的单元名字：

   ```tcl
   # List the value of the attribute dont_touch
   get_attribute  <cell_name> dont_touch
   ```

　　识别当前设计集中的胶合单元(GLUE_CELLS)：

   ```tcl
　　# Example: Identify glue cells in the current design
   set GLUE_CELLS  [get_cells *-filter "is_hierarchicai == false"]
   ```

### 2.5 启动环境的配置

这些设置主要是在`.synopsys_dc.setup`文件中；或者在`common_setup.tcl`和`dc_setup.tcl`文件中，然后`.synopsys_dc.setup`文件把这两个文件包含。

`·common_setup.tcl`文件中:

```tcl
set ADDITIONAL_SEARCH_PATH   "./libs/sc/LM   ./rtl ./scripts"
set TARGET_LIBRARY_FILES  sc_max.db
set ADDL_LINK_LIBRARY_FILES  IP_max.db
set SYMBOL_LIBRARY_FILES   sc.sdb
set MW_DESIGN_LIB  MY_DESIGN_LIB
set MW_REFERENCE_LIB_DIRS  "./libs/mw_lib/sc   ./libs/mw_libs/IP"
set TECH_FILE    ./Iibs/tech/cb13_6m.tf
set TLUPLUS_MAX__FILE   ./Iibs/tlup/cb13_6m_max.tluplus
set MAP FILE   ./Iibs/tlup/cb13_6m.map
```

`·dc_setup.tcl`文件中：

库的设置

```tcl
set_app_var search_path   "$search_path  $ADDITIONAL_SEARCH_PATH"
set_app_var target_library   $TARGET_LIBRARY_FILES
set_app_var link_library    "*  $target_library  $ADDL_LINK_LIBRARY_FILES"
set_app_var symbol_library   $SYMBOL_LIBRARY_FILES
set_app_var mw_reference_library   $MW_REFERENCE_LIB_DIRS
set_app_var mw_design_library    $MW_DESIGN_LIB
get_app_var -list   -only_changed_vars   *
```

如果存在Milkyway design库，那就不创建；否则创建Milkyway design库

```tcl
if {![file  isdirectory  $mw_design Jibrary ]} {
   create_mw_lib  -technology  $TECH_FILE 　-mw_reference_library  $mw_reference_library  $mw_design_library
}

open_mw_lib  $mw_design_library
check_library

set_tlu_plus_tiles -max_tluplus  $TLUPLUS_MAX_FILE  -tech2itf_map  $MAP_FILE
check_tlu_plus_files

history  keep  200
set_app_var  alib_library_analysis_path   ../ ;# ALIB files

define_design_lib   WORK   -path   ./work
set_svf <myjilename.svf>
set_app_var sh_enable_page_mode   false

suppress_message   {LINT-28   LINT-32   LINT-33   UID-401}
set_app_var  alib_library_analysis_path   [get_unix_variable   HOME]
alias h   history
alias rc "report_constraint   -all_violators"
```

### 2.6 DC的启动方式（举例）

```bash
dc_shell   -topographical  #交互式启动
dc_shell-topo>  start_gui   #启动图形化界面
dc_sheli-topo>  stop_gui   #停止图形化界面
design_vision  -topographical  #启动图形化界面的同时，调用拓扑模式
dc_shell  -topo  -f dc.tcl  | tee -i dc.log  #批处理模式
```

### 2.7 读入设计

有下面这些读入情况：

```tcl
read_db library_file.db
read_verilog  {A.v  B.v   TOP.v}
read_sverilog  {A.sv  B.sv  TOP.sv}
read_vhdl   {A.vhd  B.vhd  TOP.vhd}
read_ddc   MY_TOP.ddc
analyze  -format  verilog  {A.v  B.v  TOP.v}
elaborate  MY_TOP  -parameters "A_WIDTH=8, B__WIDTH=16"
```

然后是读入设计后的一些必要操作：

- 设置顶层设计：
  
  ```tcl
  current_design   MY_T0P
  ```

- 检查是否缺失子模块：link
- 检查设计：

   ```tcl
   if {[check_design] ==0} {
   　　echo "Check Design Error"
   　　exit  #检查出错，退出DC
   }
   ```

- 写出读入后的未映射设计：
  
  ```tcl
  write_file  -f  ddc  -hier  -out  unmappedd/TOP.ddc
  ```

### 2.8 （环境、设计、时序等的）检查和移除

- reset_design
- report_clock
- report_clock  -skew  -attr
- report_design
- report_port -verbose
- report_path_group
- report_timing
- report_timing_requirements  -ignored
- report_auto_ungroup
- report_interclock_relation
- check_timing
- reset_path  -from  FF1_reg
- remove_clock
- remove_clockJransition
- remove_clock_uncertainty
- remove_input_delay
- remove_output_delay
- remove_driving_cell
- list_libs
- redirect  -file  reports/lib.rpt {report_lib \< libname \>}
- report_hierarchy [-noleaf] # Arithmetic implementation and resource-sharing info
- report_resources # List area for all cells in the design
- report_cell  [get_cells  -hier  *]
- check_design
- check_design -html check_design.html
- sh firefox check_design.html
- report_constraint  -all_violators
- report_timing 　[ -delay \<max \| min> ]
  - [-to < pin_port_clock_list > ]
  - [ -from < pin__port_clock_list > ]
  - [ -through < pin_port_list > ]
  - [ -group]
  - [ -input__pins ]
  - [ -max_paths <path_count> ]
  - [ -nworst <paths_per_endpoint_count >]
  - [ -nets ]
  - [ -capacitance ]
  - [ -significant_digits < number >]
  - report_qor
- report_area
- report_congestion

### 2.9 约束的设置和执行

1. 预算估计：

   如果实际输出负载值未知，则用于"负载预算"。找到库中最大的max_capacitance值，并将该值作为保守的输出负载。

   ```tcl
   set LIB_NAME ssc_core_slow
   set MAX_CAP 0
   set OUTPUT_PINS [get_lib_pins  $LIB_NAME/*/* -filter "direction == 2"]

   foreach_in_collection  pin  $OUTPUT_PINS {
      set  NEW_CAP  [get_attribute  Spin  max_capacitance]
      if {$NEW_CAP > $MAX_CAP} {
   　　　set MAX_CAP  $NEW_CAP
   　　}
   }

   set_load  $MAX _CAP  [all_outputs]
   ```

2. 普通的约束：

   ```tcl
   reset_design

   #############CLOCKS###################
   # 默认情况下，每一个时钟都只对于一个时钟，除非设置下面的命令为真：

   set_app_var  timing_enable_multiple_clocks_per_reg  true

   #下面是时钟建模的例子：
   create_clock -period 2 -name  Main_Clk [get_ports Clk1]
   create_clock -period 2.5 -waveform {0 1.5} [get_ports Clk2]
   create_clock -period 3.5 -name V_Clk; # 这是虚拟时钟
   create_generated_clock -name DIV2CLK -divide_by2  -source  [get_ports Clk1] [get_pins I_DIV__FF/Q]
   set_clock_uncertainty -setup 0.14 [get_clocks *]
   set_clock_uncertainty -setup 0.21 -from [get_clocks Main_Clk] -to [get_clocks Clk2]
   set_clock_latency -max 0.6 [get_clocks Main_Clk] ; # 这是版图之前的时钟情况
   set_propagated__clock  [all_clocks]; # 这是时钟树综合后的情况
   set_clock_latency  -source -max 0.3 [get_clocks Main_Clk]
   set_clock_transition  0.08  [get_clocks Main_Clk]

   ########### CLOCK TIMING EXCEPTIONS ########
   set_clock_group  -logically_exclusive | -physically_exclusive | -asynchronous  -group CLKA -group CLKB
   set_false_path -from [get_clocks Asynch_CLKA] -to [get_clocks Asynch_CLKB]
   set_multicycle_path -setup 4 -from -from A_reg -through U_Mult/Out -to B_reg
   set_multicycle_path -hold 3 -from -from A_reg -through U_Mult/Out -to B_reg
   set_input_delay -max 0.6 -clock Main_Clk [alljnputs]
   set_input_delay -max 0.3 -clock Clk2 -clock_fall -add_delay [get_ports "B  E"]
   set_input_delay  -max 0.5 -clock -network_latency_included V_Clk [get_ports "A  C  F"]
   set_output_delay -max 0.8 -clock -source_latency_included Main_Clk [all__outputs]
   set_output_delay -max 1.1 -clock V_Clk [get_ports "OUT2  OUT7]

   ################ ENVIRONMENT ######################
   set_max_capacitance 1.2 [alljnputs]; # (这是用户自定义的设计规则约束)
   set_load 0.080  [all_outputs]
   set_load [expr [load_of slow_proc/NAND2_3/A] * 4] [get_ports OUT3]
   set_load 0.12 [all_inputs]
   set_input_transition 0.12 [remove_from_collection [all_inputs][get_ports  B]]
   set_driving_cell -lib_cell FD1 -pin Q [get_ports B]
   ```

3. 与物理设计有关的约束：

   ```tcl  
   create_bounds
   create_rp_groups
   set_app_var placer_soft_keepout_channel_width...
   set_app_var placer_max_cell_density_threshold...
   set_congestion_options...
   setjgnoredjayers...
   set_aspect_ratio 0.5 # (高度和宽度的比值)
   set_utilization  0.7 #（利用率）
   set_placement_area  -coordinate  {0 0 600 400}
   create_die_area  -polygon
   set_port_side {R} Port__N
   set_port_location -coordinate {0 40} PortA
   set_cell_location -coordinate {400 160} -fixed -orientation {N} RAM1
   create_placement_blockage -name Blockagel -coordinate {350 110 600 400}
   create_bounds -name "b1" -coordinate {100 100 200 200} INST_1
   create_site_row -coordinate {10,10} -kind CORE -space 5 -count 3 {SITE_ROW#123}
   create_voltage_area -name VA1 -coordinate {100 100 200 200} INST_1
   create_net__shape -type wire -net VSS -origin {0 0} -length 10 -width 2 -layer M1
   create_wiring_keepouts -name "my__keep1" -layer "METAL1" -coord {12 12 100 100}
   report_physical_constraints
   reset_physical_constraints
   ```

4. 约束的执行

   ```tcl
   redirect -tee -file reports/precompile.rpt {source -echo -verbose TOP.con}
   redirect -append -tee -file reports/precompile.rpt {check_timing}
   ```

   如果有直接的tcl约束，那么直接约束：

   ```tcl
   source <Physical_Constraints_TCL_file>
   ```

   如果没有的话，可以从物理设计中抽取：

   ```tcl
   extract_physieal_constraints  <DEF_file>
   read_floorplan  <floorplan_cmd_file>  
   ```

### 2.10 综合优化

1. 路径分组：

   - group_path -name CLK1 -criticai_range <10% of CLK1 Period> -weight 5
   - group_path -name CLK2 -critical_range <10% of CLK2 Period> -weight 2
   - group_path -name INPUTS -from [alljnputs]
   - group_path -name OUTPUTS -to [all_outputs]
   - group_path -name COMBO -from [alljnputs] -to [all_outputs]
   - set_fix_multiple_port_nets  -all  -buffer_constants

2. 综合时的选项：

   ```tcl
   # Enable multi-core optimization, if applicable:
   set_host_options  -max_cores <#>
   report_host__options
   remove_host_options
   ```

   防止特定的子模块被ungrouped:

   ```tcl
   set_ungroup  <top_level_and/or_pipeiined_blocks>  false
   ```

   防止DesignWare层次结构被 ungrouped:

   ```tcl
   set_app_var  compile_ultra_ungroup_dw  false
   ```

   如果需要：禁用特定子设计的边界优化:

   ```tcl
   set_boundary_optimization  < cells or designs >  false
   ```

   如果需要：从适应性重新定时中排除特定的单元/设计(-retime)(也就是放在某些模块或者设计的寄存器被retime移动):

   ```tcl
   set_dont_retime  <cells_or_designs>  true
   ```

   如果需要：通过手动控制寄存器复制的个数; 最大扇出的情况:

   ```tcl
   set_register_replication [-num_copies 3 | -max_fanout 40]   [get_cells  B_reg]
   ```

   如果需要：更改寄存器复制命名样式:

   ```tcl
   set_app_var  register_replication_naming_style  "%s_rep%d"
   ```

   如果要求应用，那么就要为测试准备的综合选择扫描寄存器，并且禁止自动地移位寄存器定义:

   ```tcl
   set_scan_configuration -style <multiplexed_flip_flop | clocked_scan | lssd | aux_clock_lssd>
   set_app_var compile_seqmap_identify_shift_registers false
   ```

   如果有要求保持流水线中的寄存器器输出，就要进行约束：

   ```tcl
   set_dont_retime   [get_cells  U_Pipeline/R12_reg*]  true
   ```

   如果设计中包含有纯的流水线设计，那么可以进行寄存器retiming:

   ```tcl
   set_optimize_registers  true  -design  My_Pipeline_Subdesign -clock CLK1 -delay_threshold <clock_period>
   ```

   默认情况下，整个层次结构使用compile_ultra -spg进行拥塞优化,选择性地禁用/启用子设计上的拥塞优化: 

   ```tcl
   set_congestion_optimization  [get_designs A]  false
   ```

   第一次编译：根据需要启用/禁用优化:

   ```tcl
   compile_ultra -scan -retime -timing [-spg] \
      [-no_boundary] \
      [-no_autoungroup] \
      [-no_design_rule] \
      [-no_seq_output_inversion]
   ```

   根据需要，更多地关注违规的关键路径：

   ```tcl
   group_path -name <group_name> -from <path_start> -to <path_end>  -critical range <10% of max delay goal> -weight 5
   ```

   执行增量编译:

   ```tcl
   compile_ultra -scan -timing -retime -incremental [-spg]
   ```

### 2.11 综合后处理

- set_app_var verilogout_no_tri true
- change_names -rule verilog -hier
- write_file - f verilog -hier -out mapped/TOP.v
- write__file - f ddc -hier -out mapped/TOP.ddc
- write_sdc TOP.sdc
- write_scan_def -out TOP_scan.def

## 3.实验Demo

待综合代码文件为state_machine.v，模块名为state_machine，初始代码为:

[GITHUB](https://github.com/SunicYosen/dc-example/blob/master/src/vsrc/state_machine.v)

```verilog
module  state_machine(input          clk,
                      input          reset,
                      input          compare_result,
                      output  [3:0]  new_state,
                      output         hold,
                      output         error);

reg [3:0] state;
reg error_state;

always @(posedge clk)
begin
  if(reset)
  begin
    state <= 4'b1111;
    error_state <= 1'b1;
  end

  else if (compare_result)
  begin
    case (state)
      4'b1111: state <= 4'b1111;
      4'b1100: state <= 4'b0011;
      4'b1000: state <= 4'b0100;
      4'b0100: state <= 4'b0011;
      4'b0011: state <= 4'b1111;
      4'b0010: state <= 4'b0001;
      4'b0001: state <= 4'b1111;
      default: state <= 4'b1111;
    endcase
  end

  else
  begin
    case (state)
      4'b1111: state <= 4'b1100;
      4'b1100: state <= 4'b1000;
      4'b1000: error_state <= 1'b1;
      4'b0100: error_state <= 1'b1;
      4'b0011: state <= 4'b0010;
      4'b0010: error_state <= 1'b1;
      4'b0001: error_state <= 1'b1;
      default: error_state <= 1'b1;
    endcase
  end
end

assign new_state = state;
assign error = error_state;
assign hold  = !state[0];

endmodule
```

DC的脚本：

[GITHUB dc.tcl](https://github.com/SunicYosen/dc-example/blob/master/src/dc/scripts/dc.tcl)
[GITHUB read.tcl](https://github.com/SunicYosen/dc-example/blob/master/src/dc/scripts/read.tcl)

约束文件：

[GITHUB sm.con](https://github.com/SunicYosen/dc-example/blob/master/src/dc/scripts/sm.con)

Terminal打开DC

```bash
dc_shell-t
```

终端变为： `$dc_shell>`

`$dc_shell>`下执行脚本：

```tcl
source dc.tcl
```

`$dc_shell>`下打开图像界面：

```tcl
gui_start
```

然后`compile design`

> Design -> Compile Design

然后查看电路图：

> Schematic -> Create New Schematic

结果如下图所示：

![Schimatic of Design](/img/2019-07-23-Design-Compiler-Usage/Schimatic-of-Design.png "Schimatic of Design"){: .center-image .eighty-percent-image}

大概的流程为：

***准备好文件 -> 启动DC -> 读入设计前的检查 -> 读入设计和查看设计 ->约束设计 -> 综合 -> 综合后检查（与优化） -> 保存优化后的设计***

## Reference

<span id="rf1"></span>[[1]](#rrf1) Tcl与Design Compiler （三）——DC综合的流程, [OL], 2019.07.26, [https://www.cnblogs.com/IClearner/p/6618992.html](https://www.cnblogs.com/IClearner/p/6618992.html)

<span id="rf2"></span>[[2]](#rrf2) Tcl与Design Compiler （十三）——Design Compliler中常用到的命令（示例）总结, [OL], 2019.07.26, [https://www.cnblogs.com/IClearner/p/6663680.html](https://www.cnblogs.com/IClearner/p/6663680.html)

## 推荐阅读

\[1\] [Tcl与Design Compiler](https://www.cnblogs.com/IClearner/category/972492.html)
