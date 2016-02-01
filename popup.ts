/// <reference path="typings/main.d.ts" />
"use strict";


document.addEventListener('DOMContentLoaded',
                          () => {
                              var request = new XMLHttpRequest();
                              request.open("GET",
                                           "https://www.oxforddictionaries.com/" + 
                                           "definition/american_english/punt");
                              request.onload = () => {
                                  var response = request.response;
                                  if (!response || !response.responseData ||
                                      !response.responseData.results ||
                                      response.responseData.results.length === 0) {
                                      renderStatus("No response from server.");
                                  }

                                  var body = document.createElement("body");
                                  body.innerHTML = request.responseText;
                                  var wordDefinition = body.querySelectorAll(
                                      "div.responsive_cell_center");
                                  var css =<HTMLLinkElement>
                                      body.querySelector("link[type='text/css']");
                                  console.log(css);

                                  renderStatus(css.outerHTML +
                                               wordDefinition.item(0).innerHTML);
                              }
                              
                              request.onerror = () => {
                                  renderStatus("Error when trying to send " +
                                               "request!");
                               
                              }
                              
                              request.send();
                          })

function renderStatus(htmlFromDictionary: string) {
    document.body.innerHTML = htmlFromDictionary;
}
