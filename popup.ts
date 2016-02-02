/// <reference path="typings/main.d.ts" />
"use strict";


document.addEventListener('DOMContentLoaded',
                          () => {
                              var request = new XMLHttpRequest();
                              request.open("GET",
                                           "https://www.oxforddictionaries.com/" + 
                                           "definition/american_english/punt");
                              request.onload = () => {
                                  if (request.status !== 200) {
                                      renderStatus("Bad response from server." +
                                                  "Status: " + request.status);
                                      return;
                                  }
                                  renderStatus(parseHtml(request));
                              }
                              // TODO Can't pronounce
                              request.onerror = () => {
                                  renderStatus("Error when trying to send " +
                                               "request!");
                               
                              }
                              
                              request.send();
                          })

function renderStatus(htmlFromDictionary: string): void {
    document.body.innerHTML = htmlFromDictionary;
}

function parseHtml(request: XMLHttpRequest): string {
    var body = document.createElement("body");
    body.innerHTML = request.responseText;
    var wordDefinition = body.querySelectorAll(
        "div.responsive_cell_center");
    var css = <HTMLLinkElement> body.querySelector("link[type='text/css']");
//    var js = <HTMLLinkElement> body.querySelector("link[type='text/javascript'");
    return/* js.outerHTML + */ css.outerHTML + wordDefinition.item(0).innerHTML;
}
