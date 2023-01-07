import React from "react";

export const getToken = () => {
    var arrayb = document.cookie.split(";");
    for (const item of arrayb) {
      if (item.startsWith("jwtoken=")) {
        return item.substr(8);
      }
    }
  }