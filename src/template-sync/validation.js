import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const SENSITIVE_ENV_NAME_PATTERN = /(?:^|_)(?:TOKEN|KEY|SECRET|PASSWORD|CREDENTIAL|AUTH)(?:_|$)/i;

export function isSensitiveEnvironmentName(name) {
  return SENSITIVE_ENV_NAME_PATTERN.test(name);
}

export function commandEnvironment(command, env = process.env) {
  const sanitizedEnv = Object.fromEntries(Object.entries(env).filter(([name]) => !isSensitiveEnvironmentName(name)));
  if (command !== "corepack") {
    return sanitizedEnv;
  }
  return {
    ...sanitizedEnv,
    COREPACK_ENABLE_AUTO_PIN: "0",
    YARN_ENABLE_SCRIPTS: "0",
  };
}

function runCommand(command, args, { cwd, timeoutMs = 10 * 60 * 1000 } = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, shell: false, env: commandEnvironment(command) });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ command: [command, ...args].join(" "), exitCode: 127, stdout, stderr: error.message });
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ command: [command, ...args].join(" "), exitCode, stdout, stderr });
    });
  });
}

export function readPackageScripts(root) {
  const packageJsonPath = path.join(root, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).scripts || {};
}

export function detectPackageManager(root) {
  const packageJsonPath = path.join(root, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageManager = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).packageManager || "";
    const packageManagerName = String(packageManager).split("@")[0];
    if (["npm", "pnpm", "yarn"].includes(packageManagerName)) {
      return packageManagerName;
    }
  }
  if (fs.existsSync(path.join(root, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (fs.existsSync(path.join(root, "yarn.lock"))) {
    return "yarn";
  }
  return "npm";
}

export function packageScriptCommand(packageManager, scriptName) {
  if (packageManager === "npm") {
    return { command: "npm", args: ["run", scriptName] };
  }
  return { command: "corepack", args: [packageManager, scriptName] };
}

function packageJsonValidationFailure(error) {
  return {
    command: "parse package.json",
    exitCode: 1,
    stdout: "",
    stderr: `Invalid package.json: ${error.message}`,
  };
}

export async function refreshDependencies({ root, changedFiles }) {
  if (!changedFiles.some((file) => file === "package.json" || file.endsWith("/package.json"))) {
    return [];
  }
  if (fs.existsSync(path.join(root, "pnpm-lock.yaml"))) {
    return [await runCommand("corepack", ["pnpm", "install", "--lockfile-only", "--ignore-scripts"], { cwd: root })];
  }
  if (fs.existsSync(path.join(root, "package-lock.json"))) {
    return [await runCommand("npm", ["install", "--package-lock-only", "--ignore-scripts"], { cwd: root })];
  }
  if (fs.existsSync(path.join(root, "yarn.lock"))) {
    return [await runCommand("corepack", ["yarn", "install", "--mode", "update-lockfile"], { cwd: root })];
  }
  return [];
}

export function skippedPrivilegedValidationResults() {
  return [
    {
      command: "dependency refresh and repository validation",
      exitCode: 0,
      stdout: "",
      stderr: "Skipped because generated repository code is untrusted in the privileged command workflow.",
      status: "skipped",
    },
  ];
}

export async function runValidation({ root }) {
  let scripts;
  let packageManager;
  try {
    scripts = readPackageScripts(root);
    packageManager = detectPackageManager(root);
  } catch (error) {
    return [packageJsonValidationFailure(error)];
  }
  const commands = ["lint", "typecheck", "test"].filter((scriptName) => scripts[scriptName]);
  const results = [];
  for (const scriptName of commands) {
    const { command, args } = packageScriptCommand(packageManager, scriptName);
    results.push(await runCommand(command, args, { cwd: root }));
  }
  return results;
}
