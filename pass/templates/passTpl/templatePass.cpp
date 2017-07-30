#include <llvm/Pass.h>
using namespace llvm;

namespace {
struct <%= passName %> : public <%= passScope %>Pass {
    static char ID;
    <%= passName %>() : <%= passScope %>Pass(ID){}
    
    bool runOn<%= passScope %>(<%= passScope %> &<%= scopeShortHand %>) override ;
};
} // anonymous namespace

bool <%= passName %>::runOn<%= passScope %>(<%= passScope %> &<%= scopeShortHand %>) {
    return false;
}

char <%= passName %>::ID = 0;
static 
RegisterPass<<%= passName %>> X("<%= passShortHand %>",
                                "<%= passDescription %>",
                                false /*Only Look At CFG*/,
                                false /*Is Analysis Pass*/);



