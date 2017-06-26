#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var clear = require("clear");
var CLI = require("clui");
var figlet = require("figlet");
var inquirer = require("inquirer");
var confirm = require("inquirer-confirm");
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
clear();
console.log(
  chalk.yellow(
    figlet.textSync("Weather Commander", { horizontalLayout: "full" })
  )
);

var temperatureQ = {
  name: "zipcode",
  type: "input",
  message: "Enter your zipcode to get the temperature"
};

var repeatQ = {
  name: "repeat",
  type: "confirm",
  message: "Would you like to check another?",
  default: true
};

function main() {
  console.log(chalk.red("How Hot is it?"));
  getZipcode();
}

function getZipcode() {
  inquirer.prompt(temperatureQ).then(function(answer) {
    //TODO validate answer to question is an 5 digit zipcode, not a string!!!
    if (parseInt(answer.zipcode) && answer.zipcode.toString().length == 5) {
      getWeather(answer);
    } else {
      console.log(chalk.red("Input must be a valid zipcode"));
      main();
    }
  });
}

function getWeather(answer) {
  const weatherURL = `http://api.openweathermap.org/data/2.5/weather?zip=${answer.zipcode}&appid=63a12df03524d4271e29ea55930cce2d`;

  //Run fancy status spinner .start() to run it, .stop() to end it
  var status = new Spinner(chalk.blue.underline.bold("Getting the Weather..."));
  status.start();

  fetch(weatherURL)
    .then(resp => resp.json())
    .then(function(data) {
      // Here you get the data to modify as you please
      //convert to fahrenheit
      let tempInFahrenheit = convertKelvinFahrenheit(data.main.temp);
      status.stop();
      console.log(`The tempeture in ${data.name} is ${tempInFahrenheit}`);
      repeatWeather();
    })
    .catch(function(error) {
      // If there is any error you will catch them here
      console.log(error);
      repeatWeather();
    });
  //Get weather data and console.log out the temp in fahrenheit NOT Celcius
}

function repeatWeather() {
  inquirer.prompt(repeatQ).then(function(answer) {
    console.log(answer);
  });
}

function convertKelvinFahrenheit(kTemp) {
  // ° F = 1.8(K - 273) + 32
  return Math.floor(1.8 * (kTemp - 273) + 32);
}

main();
