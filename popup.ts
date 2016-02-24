/// <reference path="typings/main.d.ts" />
"use strict";

document.addEventListener('DOMContentLoaded',
                          () => {
                              var inputField = <HTMLInputElement> document.getElementById("word_to_look_up");
                              chrome.runtime.onMessage.addListener(function(request, sender) {
                                  if (request.action == "selectedText") {
                                      inputField.value = request.source;
                                      handleDefineButton();
                                  }
                              });

                              chrome.tabs.executeScript(null, {
                                  file: "content.js"
                              }, function() {
                                  // If you try and inject into an extensions page
                                  // or the webstore/NTP you'll get an error
                                  if (chrome.runtime.lastError) {
                                      alert("There was an error injecting script: \n"
                                          + chrome.runtime.lastError.message);
                                  }
                              });

                              document.getElementById("define_button").addEventListener("click",
                                  handleDefineButton, false);

                              inputField.addEventListener("keyup",
                                  (event: KeyboardEvent) => {
                                      if (event.keyCode == 13) {
                                          handleDefineButton();
                                      }
                                  }, false);
                              inputField.focus();
                              inputField.select();
                          });

enum Language {
    British,
    American
}

function handleDefineButton(): void {
    var word = (<HTMLInputElement> document.getElementById("word_to_look_up")).value;

    var languageAsString = (<HTMLSelectElement> document.getElementById("language")).value;
    var language: Language;
    if (languageAsString == "american") {
        language = Language.American;
    } else if (languageAsString == "british") {
        language = Language.British;
    } else {
        alert("Wrong language!");
    }

    sendRequest(language, word);
}

function sendRequest(language: Language, word: string): void {
    var languageStringValue = (language == Language.American) ? "american_english" : "english";

    var request = new XMLHttpRequest();
    request.open("GET",
        "https://www.oxforddictionaries.com/" +
        "search/?direct=1&multi=1&dictCode=" + languageStringValue + "&q=" + word);
    request.onload = () => {
        if (request.status != 200 && request.status != 404) {
            alert("Bad response from server." +
                "Status: " + request.status);
            return;
        }
        if (request.status == 404) {
            renderStatus("No definition found!");
            return;
        }

        renderStatus(parseHtml(request));
        addEventListenersForAudioElements();
        document.getElementById("define_button").addEventListener("click", handleDefineButton, false);
        (<HTMLInputElement> document.getElementById("word_to_look_up")).value = word;
    };
    request.onerror = () => {
        alert("Error when trying to send request!");
    };

    request.send();
}

function renderStatus(htmlFromDictionary: string): void {
    var wordDefinitionDiv = document.getElementById("word_definition");
    wordDefinitionDiv.innerHTML = htmlFromDictionary;
}

function parseHtml(request: XMLHttpRequest): string {
    var body = document.createElement("body");
    body.innerHTML = request.responseText;
    var wordDefinition = body.querySelectorAll("div.responsive_cell_center");
    var css = <HTMLLinkElement> body.querySelector("link[type='text/css']");
    return css.outerHTML + (<HTMLElement> wordDefinition.item(0)).innerHTML;
}

function addEventListenersForAudioElements(): void {
    var elementsWithPlayClass = document.getElementsByClassName("audio_play_button");
    for (var i = 0; i < elementsWithPlayClass.length; i++) {
        elementsWithPlayClass.item(i).addEventListener("click", function() {
            var srcMp3 = this.getAttribute("data-src-mp3");
            var srcOgg = this.getAttribute("data-src-ogg");

            if (supportAudioHtml5()) {
                playHtml5(srcMp3, srcOgg);
            } else {
                alert("Something wrong with audio!");
            }
        }, false);
    }
}

function supportAudioHtml5() {
    var audioTag  = document.createElement("audio");
    try {
        return (!!(audioTag.canPlayType)
        && ((audioTag.canPlayType("audio/mpeg") != "no" && audioTag.canPlayType("audio/mpeg") != "")
        || (audioTag.canPlayType("audio/ogg") != "no" && audioTag.canPlayType("audio/ogg") != "" )));
    } catch(e) {
        return false;
    }
}

var audio = null;
function playHtml5(srcMp3, srcOgg) {
    if (audio != null){
        // PLODOMAINT-345: avoid overlapping
        if (!audio.ended){
            audio.pause();
            if(audio.currentTime > 0) {
                audio.currentTime = 0
            }
        }
    }

    // Use appropriate source.
    audio = new Audio("");
    if (audio.canPlayType("audio/mpeg") != "no" && audio.canPlayType("audio/mpeg") != "") {
        audio = new Audio(srcMp3);
    } else if (audio.canPlayType("audio/ogg") != "no" && audio.canPlayType("audio/ogg") != "") {
        audio = new Audio(srcOgg);
    }

    // Play
    audio.addEventListener("error", function() {
        alert("Apologies, the sound is not available.");
    });
    audio.play();
}