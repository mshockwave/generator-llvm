
llvm_map_components_to_libnames(LLVM_LIBS_ 
                                <%= llvmDepLibs %>)

set(SOURCE_FILES 
    main.cpp)
add_executable(<%= progName %> ${SOURCE_FILES})
target_link_libraries(<%= progName %> ${LLVM_LIBS_})
