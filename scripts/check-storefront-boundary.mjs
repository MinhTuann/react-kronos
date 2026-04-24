import fs from "fs";
import path from "path";

const repoRoot = process.cwd();
const storefrontPackagePath = path.join(repoRoot, "apps/storefront/package.json");
const publicSafeContractsPackageName = "@kronos/contracts-public";
const disallowedContractsPackageName = "@kronos/contracts";
const internalContractsPackageName = "@kronos/contracts-internal";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

try {
  const storefrontPackageJson = readJson(storefrontPackagePath);
  const dependencies = storefrontPackageJson.dependencies ?? {};
  const devDependencies = storefrontPackageJson.devDependencies ?? {};
  const problems = [];

  if (!dependencies[publicSafeContractsPackageName]) {
    problems.push(`Storefront must depend on "${publicSafeContractsPackageName}".`);
  }

  if (dependencies[disallowedContractsPackageName]) {
    problems.push(`Storefront still depends on "${disallowedContractsPackageName}".`);
  }

  if (dependencies[internalContractsPackageName] || devDependencies[internalContractsPackageName]) {
    problems.push(`Storefront must not depend on "${internalContractsPackageName}".`);
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`FAIL: ${problem}`);
    }
    process.exit(1);
  }

  console.log("PASS: Storefront dependency boundary is safe for public mirroring.");
} catch (error) {
  console.error(
    `FAIL: Unable to validate storefront boundary: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exit(1);
}
