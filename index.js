#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var clear = require("clear");
var CLI = require("clui");
var figlet = require("figlet");
var inquirer = require("inquirer");
var Preferences = require("preferences");
var Spinner = CLI.Spinner;
var GitHubApi = require("github");
var _ = require("lodash");
var git = require("simple-git")();
var touch = require("touch");
var fs = require("fs");
var fetch = require("node-fetch");
var files = require("./lib/files");

//clear console and banner our title
const weatherURL =
  "http://openweathermap.org/data/2.5/weather?zip=85016,us&appid=b1b15e88fa797225412429c1c50c122a1";

clear();
console.log(
  chalk.yellow(
    figlet.textSync("Weather Commander", { horizontalLayout: "full" })
  )
);

var question = {
  name: "zipcode",
  type: "input",
  message: "Enter your zipcode to get the temperature"
};

function main() {
  console.log(chalk.red("How Hot is it?"));
  getZipcode();
}

function getZipcode() {
  inquirer.prompt(question).then(function(answer) {
    getWeather(answer);
  });
}

function getWeather(zipcode) {
  var status = new Spinner(chalk.blue.underline.bold("Getting the Weather..."));
  status.start();
  fetch(weatherURL)
    .then(resp => resp.json())
    .then(function(data) {
      // Here you get the data to modify as you please
      console.log("\n");
      console.log(data.main);
      status.stop();
    })
    .catch(function(error) {
      // If there is any error you will catch them here
      console.log(error);
    });
}

main();
