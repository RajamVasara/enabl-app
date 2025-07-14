#include <emscripten.h>
#include <string>

extern "C" {

// Counts number of words in a string
EMSCRIPTEN_KEEPALIVE
int count_words(const char* text) {
    std::string str(text);
    int count = 0;
    bool inWord = false;

    for (char c : str) {
        if (isspace(c)) {
            inWord = false;
        } else if (!inWord) {
            inWord = true;
            count++;
        }
    }

    return count;
}
}
