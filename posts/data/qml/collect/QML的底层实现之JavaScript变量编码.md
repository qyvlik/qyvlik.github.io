# QML的底层实现之JavaScript变量编码

> 作者 [qyvlik](http://blog.qyvlik.space)

QML 是基于 *ECMA-262*（JavaScript），通过 Qt 的机制进行拓展的高级编程语言。下面会简单讲讲 JavaScript 变量是如何在 C++ 中定义的。

先看如下一段话：

> We use two different ways of encoding JS values. One for 32bit and one for 64bit systems.

> In both cases, we use 8 bytes for a value and a different variant of NaN boxing. A Double NaN (actually -qNaN) is indicated by a number that has the top 13 bits set, and for a signalling NaN it is the top 14 bits. The other values are usually set to 0 by the processor, and are thus free for us to store other data. We keep pointers in there for managed objects, and encode the other types using the free space given to use by the unused bits for NaN values. This also works for pointers on 64 bit systems, as they all currently only have 48 bits of addressable memory. (Note: we do leave the lower 49 bits available for pointers.)

> On 32bit, we store doubles as doubles. All other values, have the high 32bits set to a value that will make the number a NaN. The Masks below are used for encoding the other types.

> On 64 bit, we xor Doubles with (0xffff8000 << 32). That has the effect that no doubles will get encoded with bits 63-49 all set to 0. We then use bit 48 to distinguish between managed/undefined (0), or Null/Int/Bool/Empty (1). So, storing a 49 bit pointer will leave the top 15 bits 0, which is exactly the 'natural' representation of pointers. If bit 49 is set, bit 48 indicates Empty (0) or integer-convertible (1). Then the 3 bit below that are used to encode Null/Int/Bool.

> On both 32bit and 64bit, Undefined is encoded as a managed pointer with value 0. This is the same as a nullptr.

> Specific bit-sequences:

> 0 = always 0

> 1 = always 1

> x = stored value

> a,b,c,d = specific bit values, see notes

> 64bit:

    32109876 54321098 76543210 98765432 10987654 32109876 54321098 76543210 |
    
    66665555 55555544 44444444 33333333 33222222 22221111 11111100 00000000 | JS Value
    
    ------------------------------------------------------------------------+--------------
    
    00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 | Undefined
    
    00000000 0000000x xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx | Managed (heap pointer)
    
    a0000000 0000bc00 00000000 00000000 00000000 00000000 00000000 00000000 | NaN/Inf
    
    dddddddd ddddddxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx | double
    
    00000000 00000010 00000000 00000000 00000000 00000000 00000000 00000000 | empty (non-sparse array hole)
    
    00000000 00000011 10000000 00000000 00000000 00000000 00000000 00000000 | Null
    
    00000000 00000011 01000000 00000000 00000000 00000000 00000000 0000000x | Bool
    
    00000000 00000011 00100000 00000000 xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx | Int

> Notes:
> - a: xor-ed signbit, always 1 for NaN

> - bc, xor-ed values: 11 = inf, 10 = sNaN, 01 = qNaN, 00 = boxed value

> - d: xor-ed bits, where at least one bit is set, so: (val >> (64-14)) > 0

> - Undefined maps to C++ nullptr, so the "default" initialization is the same for both C++ and JS

> - Managed has the left 15 bits set to 0, so: (val >> (64-15)) == 0

> - empty, Null, Bool, and Int have the left 14 bits set to 0, and bit 49 set to 1, so: (val >> (64-15)) == 1

> - Null, Bool, and Int have bit 48 set, indicating integer-convertible

> - xoring _val with NaNEncodeMask will convert to a double in "natural" representation, where any non double results in a NaN
  
> 32bit:

    32109876 54321098 76543210 98765432 10987654 32109876 54321098 76543210 |
    
    66665555 55555544 44444444 33333333 33222222 22221111 11111100 00000000 | JS Value
    
    ------------------------------------------------------------------------+--------------
    
    01111111 11111100 00000000 00000000 00000000 00000000 00000000 00000000 | Undefined
    
    01111111 11111100 00000000 00000000 xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx | Managed (heap pointer)
    
    a1111111 1111bc00 00000000 00000000 00000000 00000000 00000000 00000000 | NaN/Inf
    
    xddddddd ddddddxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx | double
    
    01111111 11111110 00000000 00000000 00000000 00000000 00000000 00000000 | empty (non-sparse array hole)
    
    01111111 11111111 10000000 00000000 00000000 00000000 00000000 00000000 | Null
    
    01111111 11111111 01000000 00000000 00000000 00000000 00000000 0000000x | Bool
    
    01111111 11111111 00100000 00000000 xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx | Int

> Notes:

> - the upper 32 bits are the tag, the lower 32 bits the value

> - Undefined has a nullptr in the value, Managed has a non-nullptr stored in the value

> - a: sign bit, always 0 for NaN

> - b,c: 00=inf, 01 = sNaN, 10 = qNaN, 11 = boxed value

> - d: stored double value, as long as not *all* of them are 1, because that's a boxed value (see above)

> - empty, Null, Bool, and Int have bit 63 set to 0, bits 62-50 set to 1 (same as undefined and managed), and bit 49 set to 1 (where undefined and managed have it set to 0)

> - Null, Bool, and Int have bit 48 set, indicating integer-convertible

大意如下：

使用两种不同的方式对 JS 值进行编码，一种是 32 位，一种是 64 位。

在这两种情况下，使用 8 字节（`int64`）保存一个值或者一个包装了非数字变量的变体。使用前 13 个 bit 来标定 `-qNaN`，其他位一般置为零以便使用。在后 51 位中可以保存被管理对象的指针或者其他值，这是适用 64 位操作系统，因为现有的 64 位操作系统，一般只是用 48 位（2^48-1）进行寻址，这意味着有多余的 16 位( 2^16+1 )是不会被使用的。

在 32 位系统上，直接将双精度浮点数进行保存。高 32 位配合**位遮罩**保存不同的非数字变量，例如 `int` 和指针。

在 64 位上，通过 `0xffff8000 << 32` 这个**位遮罩**存取浮点数，这样的效果是，不直接对双精度进行编码，最高的 13 位直接置为零。现在可以使用 14~17 位对其他值进行编码，在64位系统上的最高有效指针是2 ^ 48-1。

如果最高的 14 位全为零，那么低 48 位保存的是一个指针，如果第 14 位置为 1，保存的便是一个整数。这让数字和指针在运算过程中变得十分快速。（最高的 14 位中，任意一位为 1，保存的便是整数）

然后使用 15-17 位来编码其他立即数。

总结一下，就是使用 `int64` 作为 JavaScript 运行的 `var`，这个 `var` 可以保存数字或者指针。

---

代码在这里 [qv4value_p.h](https://github.com/qt/qtdeclarative/blob/dev/src/qml/jsruntime/qv4value_p.h)

[深入理解Tagged Pointer](http://www.infoq.com/cn/articles/deep-understanding-of-tagged-pointer/)