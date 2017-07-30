#include <llvm/IR/LLVMContext.h>
#include <llvm/IRReader/IRReader.h>
#include <llvm/Support/CommandLine.h>
#include <llvm/Support/SourceMgr.h>
#include <string>

using namespace llvm;

static 
cl::opt<std::string>
  InputFileName(cl::Positional,
                cl::desc("<input IR file>"),
                cl::init("-"));  

int main(int argc, char** argv){
  cl::ParseCommandLineOptions(argc, argv);
  
  LLVMContext Ctx;
  SMDiagnostic SMDiag;
  auto Mptr = parseIRFile(InputFileName, 
                          SMDiag, Ctx);
  if(!Mptr){
    errs() << SMDiag.getMessage() << "\n";
    return 1;
  }

  // **Do something to the Module!**

  return 0;
}
