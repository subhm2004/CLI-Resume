#!/usr/bin/env node
const inquirer = require("inquirer");
const chalk = require("chalk");
const terminalLink = require("terminal-link");
const resume = require("./data/resume.json");
const welcome = require("./welcome");
const animation = require("./animation");

const responseFieldColor = chalk.bold.magentaBright;
const WelcomeMessage = "Hey developer, Welcome to my resume !!!!";

function buildClickableLink(text, url) {
  return terminalLink(text, url, {
    // Keep output single-line and avoid duplicate "(url)" fallback text.
    fallback: linkText => linkText
  });
}

function main() {
  welcome();
  animation(WelcomeMessage);
  setTimeout(() => {
    resumeHandler();
  }, 750);
}

function resumeHandler() {
  inquirer
    .prompt({
      type: "list",
      message: "What do you want to know about me?",
      name: "resumeField",
      choices: [...Object.keys(resume), "Exit"]
    })
    .then(({ resumeField }) => {
      resumeField !== "Exit" && console.log("\n" + responseFieldColor(`${resumeField} :- \n`));
      switch (resumeField) {
        case "Exit":
          animation("See you soon...");
          return;
        case "Contact Me":
          Object.keys(resume["Contact Me"]).forEach(key => {
            const contactValue = resume["Contact Me"][key];
            const target = key === "Email" ? `mailto:${contactValue}` : contactValue;
            console.log(
              chalk.yellow(
                `${key}: ${buildClickableLink(contactValue, target)}`
              )
            );
          });
          break;
        default:
          resume[`${resumeField}`].forEach(content => console.log(chalk.yellow(content)));
      }
      resumeField !== "Exit" &&
        console.log(
          responseFieldColor("________________________________________________________\n")
        );
      inquirer
        .prompt({
          type: "list",
          message: "Go Back or Exit...",
          name: "returnOption",
          choices: ["Back", "Exit"]
        })
        .then(({ returnOption }) => {
          if (returnOption === "Exit") {
            animation("See you soon...");
            return;
          }
          resumeHandler();
        });
    });
}

main();
