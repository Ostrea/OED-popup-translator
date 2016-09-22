"use strict";

chrome.runtime.sendMessage({
    action: "selectedText",
    source: window.getSelection().toString()
});
