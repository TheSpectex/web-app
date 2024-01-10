import prompts from "prompts";
import { spawn } from "cross-spawn";

const packageManagerQuestion = [
  {
    type: "select",
    name: "packageManager",
    message: "Which package manager do you want to use?",
    choices: [
      { title: "npm", value: "npm" },
      { title: "pnpm", value: "pnpm" },
      { title: "yarn", value: "yarn" },
    ],
  },
];

const frameworkQuestions = [
  {
    type: "select",
    name: "framework",
    message: "Select a framework:",
    choices: [
      { title: "Angular (CLI)", value: "angular" },
      { title: "Express", value: "express" },
      { title: "Gatsby.js", value: "gatsby" },
      { title: "Next.js", value: "create-next-app" },
      { title: "Nuxt", value: "nuxt" },
      { title: "React.js", value: "create-react-app" },
      { title: "Vue.js", value: "vue" },
    ],
  },
  {
    type: "text",
    name: "projectName",
    message:
      "Enter the name of your project (press Enter to use default name):",
    initial: "my-app", // Set your default project name here
  },
];

async function createApp() {
  try {
    const packageAnswers = await prompts(packageManagerQuestion);
    const { packageManager } = packageAnswers;

    const frameworkAnswers = await prompts(frameworkQuestions);
    let { framework, projectName } = frameworkAnswers;

    // Use a default project name if none is provided
    projectName = projectName.trim() || "my-app";

    let command;
    let args;

    switch (framework) {
      case "create-react-app":
        command =
          packageManager === "pnpm"
            ? "pnpm"
            : packageManager === "yarn"
            ? "yarn"
            : "npx";
        args =
          packageManager === "npx"
            ? ["create-react-app", projectName]
            : ["create", "react-app", projectName];
        break;

      case "vue":
        command =
          packageManager === "pnpm"
            ? "pnpm"
            : packageManager === "yarn"
            ? "yarn"
            : "npm";
        args =
          packageManager === "npm"
            ? ["create", "vue@latest", projectName]
            : ["create", "vue@latest", projectName];
        break;

      case "nuxt":
        if (packageManager !== "npm") {
          console.log(
            "Method is not supported for Nuxt with selected package manager"
          );
          return;
        }
        command = "npx";
        args = ["nuxi@latest", "init", projectName];
        break;

      case "angular":
        if (packageManager !== "npm") {
          console.log(
            "Method is not supported for Angular with selected package manager"
          );
          return;
        }
        command = "npm";
        args = ["install", "-g", "@angular/cli"];
        break;

      case "express":
        command =
          packageManager === "pnpm"
            ? "pnpm"
            : packageManager === "yarn"
            ? "yarn"
            : "npm";
        args =
          packageManager === "npm"
            ? ["install", "express"]
            : packageManager === "yarn"
            ? ["add", "express"]
            : ["install", "express"];
        break;

      case "gatsby":
        command =
          packageManager === "pnpm"
            ? "pnpm"
            : packageManager === "yarn"
            ? "yarn"
            : "npm";
        args =
          packageManager === "pnpm"
            ? ["create", "gatsby"]
            : packageManager === "yarn"
            ? ["init", "gatsby"]
            : ["init", "gatsby"];
        break;

      default: // For frameworks like Next.js or others not specified
        command =
          packageManager === "pnpm"
            ? "pnpm"
            : packageManager === "yarn"
            ? "yarn"
            : "npm";
        args =
          packageManager === "npx"
            ? ["create-next-app", projectName]
            : ["create", "next-app", projectName];
        break;
    }

    const installProcess = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    installProcess.on("error", (err) => {
      console.error("Error executing the command:", err);
    });

    installProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Error: Framework installation failed with code ${code}`);
      } else {
        console.log("Framework installed successfully!");
      }
    });
  } catch (error) {
    console.error("An error occurred while prompting:", error);
  }
}

createApp();
