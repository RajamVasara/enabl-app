// utils/loadWasm.js
let wasmModule = null;

export async function loadWasmModule() {
  if (wasmModule) return wasmModule;

  const modulePromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/analyze.js";
    script.onload = () => {
      Module.onRuntimeInitialized = () => {
        const countWords = Module.cwrap("count_words", "number", ["string"]);
        wasmModule = { countWords };
        resolve(wasmModule);
      };
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return modulePromise;
}
