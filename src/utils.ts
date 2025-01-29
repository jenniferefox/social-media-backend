import express, { Request, Response, Application } from "express";

export function matchUserUUID(path: string) {
  const regex = /\/users\/([a-f0-9\-]{36})\//;
  const match = path.match(regex);

  if (match && match[1]) {
    console.log("Extracted UUID:", match[1]);
    return match[1]

  } else {
    console.log("No UUID found.")
    return;
  };
};

// test:
// const newPath = '/users/29b2d67a-c843-4743-863f-c756f1202aee/posts/'
// console.log(matchUserUUID(newPath))
