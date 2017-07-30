cmake_minimum_required(VERSION <%= minCmakeVer %>)
project(<%= topProjectName %>)

set(CMAKE_CXX_STANDARD 11)

set(LLVM_DIST_PATH "<%= llvmInstallDir %>"
        CACHE STRING "LLVM distribution install path")

set(LLVM_DIR ${LLVM_DIST_PATH}/lib/cmake/llvm)
find_package(LLVM REQUIRED CONFIG)
message(STATUS "Using LLVM version ${LLVM_PACKAGE_VERSION}")
list(APPEND CMAKE_MODULE_PATH ${LLVM_CMAKE_DIR})

set(LLVM_RUNTIME_OUTPUT_INTDIR ${CMAKE_BINARY_DIR}/${CMAKE_CFG_INTDIR}/bin)
set(LLVM_LIBRARY_OUTPUT_INTDIR ${CMAKE_BINARY_DIR}/${CMAKE_CFG_INTDIR}/lib)
include(HandleLLVMOptions)
include(AddLLVM)

add_definitions(${LLVM_DEFINITIONS})
include_directories(${LLVM_INCLUDE_DIRS})
