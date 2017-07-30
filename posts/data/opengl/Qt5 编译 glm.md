# Qt 5 编译 glm

> 不要把 `inl` 文件当做源文件。

在 pro 中指定 `CONFIG += c++11` 编译 `glm` 时，报如下错误：

```
In file included from ..\three_cpp\src\3rdparty/glm/detail/../detail/func_common_simd.inl:6:0,
                 from ..\three_cpp\src\3rdparty/glm/detail/../detail/func_common.inl:742,
                 from ..\three_cpp\src\3rdparty/glm/detail/../detail/func_common.hpp:426,
                 from ..\three_cpp\src\3rdparty/glm/detail/../detail/func_geometric.inl:5,
                 from ..\three_cpp\src\3rdparty/glm/detail/../detail/func_geometric.hpp:113,
                 from ..\three_cpp\src\3rdparty/glm/detail/../geometric.hpp:6,
                 from ..\three_cpp\src\3rdparty/glm/detail/func_matrix.inl:4,
                 from ..\three_cpp\src\3rdparty/glm/detail/func_matrix.hpp:149,
                 from ..\three_cpp\src\3rdparty/glm/detail/type_mat4x4.inl:4,
                 from ..\three_cpp\src\3rdparty/glm/detail/type_mat4x4.hpp:194,
                 from ..\three_cpp\src\3rdparty/glm/mat4x4.hpp:6,
                 from ..\three_cpp\main.cpp:13:
..\three_cpp\src\3rdparty/glm/detail/../detail/../simd/common.h: In function '__m128 glm_f32v4_abs(__m128)':
..\three_cpp\src\3rdparty/glm/detail/../detail/../simd/common.h:16:49: warning: SSE vector return without SSE enabled changes the ABI [-Wpsabi]
 GLM_FUNC_QUALIFIER __m128 glm_f32v4_abs(__m128 x)
                                                 ^
In file included from C:/Qt/Qt5.5.1/Tools/mingw492_32/lib/gcc/i686-w64-mingw32/4.9.2/include/x86intrin.h:31:0,
                 from C:/Qt/Qt5.5.1/Tools/mingw492_32/i686-w64-mingw32/include/c++/i686-w64-mingw32/bits/opt_random.h:33,
                 from C:/Qt/Qt5.5.1/Tools/mingw492_32/i686-w64-mingw32/include/c++/random:50,
                 from C:/Qt/Qt5.5.1/Tools/mingw492_32/i686-w64-mingw32/include/c++/bits/stl_algo.h:66,
                 from C:/Qt/Qt5.5.1/Tools/mingw492_32/i686-w64-mingw32/include/c++/algorithm:62,
                 from C:\Qt\Qt5.5.1\5.5\mingw492_32\include/QtCore/qglobal.h:85,
                 from C:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtGui/qopenglfunctions.h:37,
                 from C:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtGui/QOpenGLFunctions:1,
                 from ..\three_cpp\main.cpp:6:
C:/Qt/Qt5.5.1/Tools/mingw492_32/lib/gcc/i686-w64-mingw32/4.9.2/include/xmmintrin.h: In constructor 'glm::tvec4<T, P>::tvec4(T) [with T = float; glm::precision P = (glm::precision)0u]':
C:/Qt/Qt5.5.1/Tools/mingw492_32/lib/gcc/i686-w64-mingw32/4.9.2/include/xmmintrin.h:889:1: error: inlining failed in call to always_inline '__m128 _mm_set1_ps(float)': target specific option mismatch
 _mm_set1_ps (float __F)
 ^
In file included from ..\three_cpp\src\3rdparty/glm/detail/type_vec4.inl:974:0,
                 from ..\three_cpp\src\3rdparty/glm/detail/type_vec4.hpp:491,
                 from ..\three_cpp\src\3rdparty/glm/vec4.hpp:6,
                 from ..\three_cpp\main.cpp:12:
..\three_cpp\src\3rdparty/glm/detail/type_vec4_simd.inl:248:21: error: called from here
   data(_mm_set1_ps(s))
                     ^
```

> error: inlining failed in call to always_inline
> error: called from here

[Bug 63220 - error: inlining failed in call to always_inline](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=63220)

[【已解决】unimplemented: inlining failed in call to XXX function body not available](http://www.crifan.com/resolved_unimplemented_inlining_failed_in_call_to_xxx_function_body_not_available/)

> 开始，自己的想法和网上某位的一样，以为inline函数的作用域只是当前C文件，而不能被别人C文件调用

---

> linker input file unused because linking not done

> gcc: warning: ..\three_cpp\src\3rdparty\glm\detail\intrinsic_exponential.inl: linker input file unused because linking not done

```
gcc -c -pipe -fno-keep-inline-dllexport -g -Wall -Wextra -DUNICODE -D_CRT_SECURE_NO_WARNINGS -D_GLFW_USE_CONFIG_H -DQT_QML_DEBUG -DQT_DECLARATIVE_DEBUG -DQT_QUICK_LIB -DQT_WIDGETS_LIB -DQT_GUI_LIB -DQT_QML_LIB -DQT_NETWORK_LIB -DQT_CORE_LIB -DQT_NEEDS_QMAIN -I..\three_cpp -I. -I..\three_cpp\src\3rdparty -I..\three_cpp\src\3rdparty\glfw-3.1.2\include -I..\three_cpp\src\3rdparty\glfw-3.1.2\deps -IC:\Qt\Qt5.5.1\5.5\mingw492_32\include -IC:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtQuick -IC:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtWidgets -IC:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtGui -IC:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtANGLE -IC:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtQml -IC:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtNetwork -IC:\Qt\Qt5.5.1\5.5\mingw492_32\include\QtCore -Idebug -IC:\Qt\Qt5.5.1\5.5\mingw492_32\mkspecs\win32-g++  -o debug\intrinsic_exponential.o ..\three_cpp\src\3rdparty\glm\detail\intrinsic_exponential.inl
gcc: warning: ..\three_cpp\src\3rdparty\glm\detail\intrinsic_exponential.inl: linker input file unused because linking not done 
```

```
gcc -c xx.inl -0 xx.o
报警告 linker input file unused because linking not done 
并且不会生成 xx.o
在链接的时候就会报无法找到 xx.o 的链接错误。。。
```

下面直接给出 glm 的 `pri`:

```
# in root pro file set the CONFIG
# CONFIG += C++11

INCLUDEPATH += $$PWD/

DEFINES += _CRT_SECURE_NO_WARNINGS


HEADERS += \
    $$PWD/glm/detail/_features.hpp \
    $$PWD/glm/detail/_fixes.hpp \
    $$PWD/glm/detail/_noise.hpp \
    $$PWD/glm/detail/_swizzle.hpp \
    $$PWD/glm/detail/_swizzle_func.hpp \
    $$PWD/glm/detail/_vectorize.hpp \
    $$PWD/glm/detail/func_common.hpp \
    $$PWD/glm/detail/func_exponential.hpp \
    $$PWD/glm/detail/func_geometric.hpp \
    $$PWD/glm/detail/func_integer.hpp \
    $$PWD/glm/detail/func_matrix.hpp \
    $$PWD/glm/detail/func_packing.hpp \
    $$PWD/glm/detail/func_trigonometric.hpp \
    $$PWD/glm/detail/func_vector_relational.hpp \
    $$PWD/glm/detail/intrinsic_common.hpp \
    $$PWD/glm/detail/intrinsic_exponential.hpp \
    $$PWD/glm/detail/intrinsic_geometric.hpp \
    $$PWD/glm/detail/intrinsic_integer.hpp \
    $$PWD/glm/detail/intrinsic_matrix.hpp \
    $$PWD/glm/detail/intrinsic_trigonometric.hpp \
    $$PWD/glm/detail/intrinsic_vector_relational.hpp \
    $$PWD/glm/detail/precision.hpp \
    $$PWD/glm/detail/setup.hpp \
    $$PWD/glm/detail/type_float.hpp \
    $$PWD/glm/detail/type_gentype.hpp \
    $$PWD/glm/detail/type_half.hpp \
    $$PWD/glm/detail/type_int.hpp \
    $$PWD/glm/detail/type_mat.hpp \
    $$PWD/glm/detail/type_mat2x2.hpp \
    $$PWD/glm/detail/type_mat2x3.hpp \
    $$PWD/glm/detail/type_mat2x4.hpp \
    $$PWD/glm/detail/type_mat3x2.hpp \
    $$PWD/glm/detail/type_mat3x3.hpp \
    $$PWD/glm/detail/type_mat3x4.hpp \
    $$PWD/glm/detail/type_mat4x2.hpp \
    $$PWD/glm/detail/type_mat4x3.hpp \
    $$PWD/glm/detail/type_mat4x4.hpp \
    $$PWD/glm/detail/type_vec.hpp \
    $$PWD/glm/detail/type_vec1.hpp \
    $$PWD/glm/detail/type_vec2.hpp \
    $$PWD/glm/detail/type_vec3.hpp \
    $$PWD/glm/detail/type_vec4.hpp \
    $$PWD/glm/gtc/bitfield.hpp \
    $$PWD/glm/gtc/color_space.hpp \
    $$PWD/glm/gtc/constants.hpp \
    $$PWD/glm/gtc/epsilon.hpp \
    $$PWD/glm/gtc/integer.hpp \
    $$PWD/glm/gtc/matrix_access.hpp \
    $$PWD/glm/gtc/matrix_integer.hpp \
    $$PWD/glm/gtc/matrix_inverse.hpp \
    $$PWD/glm/gtc/matrix_transform.hpp \
    $$PWD/glm/gtc/noise.hpp \
    $$PWD/glm/gtc/packing.hpp \
    $$PWD/glm/gtc/quaternion.hpp \
    $$PWD/glm/gtc/random.hpp \
    $$PWD/glm/gtc/reciprocal.hpp \
    $$PWD/glm/gtc/round.hpp \
    $$PWD/glm/gtc/type_precision.hpp \
    $$PWD/glm/gtc/type_ptr.hpp \
    $$PWD/glm/gtc/ulp.hpp \
    $$PWD/glm/gtc/vec1.hpp \
    $$PWD/glm/gtx/associated_min_max.hpp \
    $$PWD/glm/gtx/bit.hpp \
    $$PWD/glm/gtx/closest_point.hpp \
    $$PWD/glm/gtx/color_space.hpp \
    $$PWD/glm/gtx/color_space_YCoCg.hpp \
    $$PWD/glm/gtx/common.hpp \
    $$PWD/glm/gtx/compatibility.hpp \
    $$PWD/glm/gtx/component_wise.hpp \
    $$PWD/glm/gtx/dual_quaternion.hpp \
    $$PWD/glm/gtx/euler_angles.hpp \
    $$PWD/glm/gtx/extend.hpp \
    $$PWD/glm/gtx/extented_min_max.hpp \
    $$PWD/glm/gtx/fast_exponential.hpp \
    $$PWD/glm/gtx/fast_square_root.hpp \
    $$PWD/glm/gtx/fast_trigonometry.hpp \
    $$PWD/glm/gtx/gradient_paint.hpp \
    $$PWD/glm/gtx/handed_coordinate_space.hpp \
    $$PWD/glm/gtx/hash.hpp \
    $$PWD/glm/gtx/integer.hpp \
    $$PWD/glm/gtx/intersect.hpp \
    $$PWD/glm/gtx/io.hpp \
    $$PWD/glm/gtx/log_base.hpp \
    $$PWD/glm/gtx/matrix_cross_product.hpp \
    $$PWD/glm/gtx/matrix_decompose.hpp \
    $$PWD/glm/gtx/matrix_interpolation.hpp \
    $$PWD/glm/gtx/matrix_major_storage.hpp \
    $$PWD/glm/gtx/matrix_operation.hpp \
    $$PWD/glm/gtx/matrix_query.hpp \
    $$PWD/glm/gtx/matrix_transform_2d.hpp \
    $$PWD/glm/gtx/mixed_product.hpp \
    $$PWD/glm/gtx/norm.hpp \
    $$PWD/glm/gtx/normal.hpp \
    $$PWD/glm/gtx/normalize_dot.hpp \
    $$PWD/glm/gtx/number_precision.hpp \
    $$PWD/glm/gtx/optimum_pow.hpp \
    $$PWD/glm/gtx/orthonormalize.hpp \
    $$PWD/glm/gtx/perpendicular.hpp \
    $$PWD/glm/gtx/polar_coordinates.hpp \
    $$PWD/glm/gtx/projection.hpp \
    $$PWD/glm/gtx/quaternion.hpp \
    $$PWD/glm/gtx/range.hpp \
    $$PWD/glm/gtx/raw_data.hpp \
    $$PWD/glm/gtx/rotate_normalized_axis.hpp \
    $$PWD/glm/gtx/rotate_vector.hpp \
    $$PWD/glm/gtx/scalar_multiplication.hpp \
    $$PWD/glm/gtx/scalar_relational.hpp \
    $$PWD/glm/gtx/simd_mat4.hpp \
    $$PWD/glm/gtx/simd_quat.hpp \
    $$PWD/glm/gtx/simd_vec4.hpp \
    $$PWD/glm/gtx/spline.hpp \
    $$PWD/glm/gtx/std_based_type.hpp \
    $$PWD/glm/gtx/string_cast.hpp \
    $$PWD/glm/gtx/transform.hpp \
    $$PWD/glm/gtx/transform2.hpp \
    $$PWD/glm/gtx/type_aligned.hpp \
    $$PWD/glm/gtx/vector_angle.hpp \
    $$PWD/glm/gtx/vector_query.hpp \
    $$PWD/glm/gtx/wrap.hpp \
    $$PWD/glm/common.hpp \
    $$PWD/glm/exponential.hpp \
    $$PWD/glm/ext.hpp \
    $$PWD/glm/fwd.hpp \
    $$PWD/glm/geometric.hpp \
    $$PWD/glm/glm.hpp \
    $$PWD/glm/integer.hpp \
    $$PWD/glm/mat2x2.hpp \
    $$PWD/glm/mat2x3.hpp \
    $$PWD/glm/mat2x4.hpp \
    $$PWD/glm/mat3x2.hpp \
    $$PWD/glm/mat3x3.hpp \
    $$PWD/glm/mat3x4.hpp \
    $$PWD/glm/mat4x2.hpp \
    $$PWD/glm/mat4x3.hpp \
    $$PWD/glm/mat4x4.hpp \
    $$PWD/glm/matrix.hpp \
    $$PWD/glm/packing.hpp \
    $$PWD/glm/trigonometric.hpp \
    $$PWD/glm/vec2.hpp \
    $$PWD/glm/vec3.hpp \
    $$PWD/glm/vec4.hpp \
    $$PWD/glm/vector_relational.hpp

SOURCES += \
#    $$PWD/glm/detail/dummy.cpp \
#    $$PWD/glm/detail/func_common.inl \
#    $$PWD/glm/detail/func_exponential.inl \
#    $$PWD/glm/detail/func_geometric.inl \
#    $$PWD/glm/detail/func_integer.inl \
#    $$PWD/glm/detail/func_matrix.inl \
#    $$PWD/glm/detail/func_packing.inl \
#    $$PWD/glm/detail/func_trigonometric.inl \
#    $$PWD/glm/detail/func_vector_relational.inl \
    $$PWD/glm/detail/glm.cpp \
#    $$PWD/glm/detail/intrinsic_common.inl \
#    $$PWD/glm/detail/intrinsic_exponential.inl \
#    $$PWD/glm/detail/intrinsic_geometric.inl \
#    $$PWD/glm/detail/intrinsic_integer.inl \
#    $$PWD/glm/detail/intrinsic_matrix.inl \
#    $$PWD/glm/detail/intrinsic_trigonometric.inl \
#    $$PWD/glm/detail/intrinsic_vector_relational.inl \
#    $$PWD/glm/detail/type_gentype.inl \
#    $$PWD/glm/detail/type_half.inl \
#    $$PWD/glm/detail/type_mat.inl \
#    $$PWD/glm/detail/type_mat2x2.inl \
#    $$PWD/glm/detail/type_mat2x3.inl \
#    $$PWD/glm/detail/type_mat2x4.inl \
#    $$PWD/glm/detail/type_mat3x2.inl \
#    $$PWD/glm/detail/type_mat3x3.inl \
#    $$PWD/glm/detail/type_mat3x4.inl \
#    $$PWD/glm/detail/type_mat4x2.inl \
#    $$PWD/glm/detail/type_mat4x3.inl \
#    $$PWD/glm/detail/type_mat4x4.inl \
#    $$PWD/glm/detail/type_vec.inl \
#    $$PWD/glm/detail/type_vec1.inl \
#    $$PWD/glm/detail/type_vec2.inl \
#    $$PWD/glm/detail/type_vec3.inl \
#    $$PWD/glm/detail/type_vec4.inl \
#    $$PWD/glm/detail/type_vec4_avx.inl \
#    $$PWD/glm/detail/type_vec4_avx2.inl \
#    $$PWD/glm/detail/type_vec4_sse2.inl \
#    $$PWD/glm/gtc/bitfield.inl \
#    $$PWD/glm/gtc/color_space.inl \
#    $$PWD/glm/gtc/constants.inl \
#    $$PWD/glm/gtc/epsilon.inl \
#    $$PWD/glm/gtc/integer.inl \
#    $$PWD/glm/gtc/matrix_access.inl \
#    $$PWD/glm/gtc/matrix_inverse.inl \
#    $$PWD/glm/gtc/matrix_transform.inl \
#    $$PWD/glm/gtc/noise.inl \
#    $$PWD/glm/gtc/packing.inl \
#    $$PWD/glm/gtc/quaternion.inl \
#    $$PWD/glm/gtc/random.inl \
#    $$PWD/glm/gtc/reciprocal.inl \
#    $$PWD/glm/gtc/round.inl \
#    $$PWD/glm/gtc/type_precision.inl \
#    $$PWD/glm/gtc/type_ptr.inl \
#    $$PWD/glm/gtc/ulp.inl \
#    $$PWD/glm/gtc/vec1.inl \
#    $$PWD/glm/gtx/associated_min_max.inl \
#    $$PWD/glm/gtx/bit.inl \
#    $$PWD/glm/gtx/closest_point.inl \
#    $$PWD/glm/gtx/color_space.inl \
#    $$PWD/glm/gtx/color_space_YCoCg.inl \
#    $$PWD/glm/gtx/common.inl \
#    $$PWD/glm/gtx/compatibility.inl \
#    $$PWD/glm/gtx/component_wise.inl \
#    $$PWD/glm/gtx/dual_quaternion.inl \
#    $$PWD/glm/gtx/euler_angles.inl \
#    $$PWD/glm/gtx/extend.inl \
#    $$PWD/glm/gtx/extented_min_max.inl \
#    $$PWD/glm/gtx/fast_exponential.inl \
#    $$PWD/glm/gtx/fast_square_root.inl \
#    $$PWD/glm/gtx/fast_trigonometry.inl \
#    $$PWD/glm/gtx/gradient_paint.inl \
#    $$PWD/glm/gtx/handed_coordinate_space.inl \
#    $$PWD/glm/gtx/hash.inl \
#    $$PWD/glm/gtx/integer.inl \
#    $$PWD/glm/gtx/intersect.inl \
#    $$PWD/glm/gtx/io.inl \
#    $$PWD/glm/gtx/log_base.inl \
#    $$PWD/glm/gtx/matrix_cross_product.inl \
#    $$PWD/glm/gtx/matrix_decompose.inl \
#    $$PWD/glm/gtx/matrix_interpolation.inl \
#    $$PWD/glm/gtx/matrix_major_storage.inl \
#    $$PWD/glm/gtx/matrix_operation.inl \
#    $$PWD/glm/gtx/matrix_query.inl \
#    $$PWD/glm/gtx/matrix_transform_2d.inl \
#    $$PWD/glm/gtx/mixed_product.inl \
#    $$PWD/glm/gtx/norm.inl \
#    $$PWD/glm/gtx/normal.inl \
#    $$PWD/glm/gtx/normalize_dot.inl \
#    $$PWD/glm/gtx/number_precision.inl \
#    $$PWD/glm/gtx/optimum_pow.inl \
#    $$PWD/glm/gtx/orthonormalize.inl \
#    $$PWD/glm/gtx/perpendicular.inl \
#    $$PWD/glm/gtx/polar_coordinates.inl \
#    $$PWD/glm/gtx/projection.inl \
#    $$PWD/glm/gtx/quaternion.inl \
#    $$PWD/glm/gtx/raw_data.inl \
#    $$PWD/glm/gtx/rotate_normalized_axis.inl \
#    $$PWD/glm/gtx/rotate_vector.inl \
#    $$PWD/glm/gtx/scalar_relational.inl \
#    $$PWD/glm/gtx/simd_mat4.inl \
#    $$PWD/glm/gtx/simd_quat.inl \
#    $$PWD/glm/gtx/simd_vec4.inl \
#    $$PWD/glm/gtx/spline.inl \
#    $$PWD/glm/gtx/std_based_type.inl \
#    $$PWD/glm/gtx/string_cast.inl \
#    $$PWD/glm/gtx/transform.inl \
#    $$PWD/glm/gtx/transform2.inl \
#    $$PWD/glm/gtx/type_aligned.inl \
#    $$PWD/glm/gtx/vector_angle.inl \
#    $$PWD/glm/gtx/vector_query.inl \
#    $$PWD/glm/gtx/wrap.inl

DISTFILES += \
    $$PWD/glm/CMakeLists.txt
```

---

[OpenGL Mathematics (GLM) ](http://glm.g-truc.net/)