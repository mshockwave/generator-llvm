#include "llvm/IR/PassManager.h"
#include "llvm/Passes/PassBuilder.h"
#include "llvm/Passes/PassPlugin.h"
using namespace llvm;

namespace {
struct <%= passName %> : public PassInfoMixin<<%= passName %>> {
  PreservedAnalyses run(<%= passScope %> &<%= scopeShortHand %>,
                        <%= passScope %>AnalysisManager &<%= scopeShortHand %>AM) {
    return PreservedAnalyses::all();
  }
};
} // end anonymous namespace

extern "C" ::llvm::PassPluginLibraryInfo LLVM_ATTRIBUTE_WEAK
llvmGetPassPluginInfo() {
  return {
    LLVM_PLUGIN_API_VERSION, "<%= passName %>", "<%= passVersion %>",
    [](PassBuilder &PB) {
      PB.registerPipelineParsingCallback(
        [](StringRef PassName, <%= passScope %>PassManager &<%= scopeShortHand %>PM,
           ArrayRef<PassBuilder::PipelineElement>) {
          if(PassName == "<%= passShortHand %>"){
            <%= scopeShortHand %>PM.addPass(<%= passName %>());
            return true;
          }
          return false;
        }
      );
    }
  };
}

