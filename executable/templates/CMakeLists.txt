cmake_minimum_required(VERSION <%= minCmakeVer %>)
project(<%= topProjectName %>)

set(CMAKE_CXX_STANDARD 11)

set(LLVM_DIST_PATH "<%= llvmInstallDir %>"
        CACHE STRING "LLVM distribution install path")

set(LLVM_DIR ${LLVM_DIST_PATH}/lib/cmake/llvm)
find_package(LLVM REQUIRED CONFIG)
message(STATUS "Using LLVM Version ${LLVM_PACKAGE_VERSION}")

include_directories(${LLVM_INCLUDE_DIRS})
add_definitions(${LLVM_DEFINITIONS})
if(NOT ${LLVM_ENABLE_RTTI})
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fno-rtti")
  message(STATUS "Disable RTTI")
endif()
link_directories(${LLVM_LIBRARY_DIRS})
