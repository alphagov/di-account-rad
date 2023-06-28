const fs = require("fs")

const funDirs = getFunctionDirs();
const buildDirs = funDirs.map(srcToBuild)
buildDirs.forEach(ensureDirExists)
copyTemplates(funDirs)
copyBaseTemplate(buildDirs)
copyGovuk(buildDirs)


function getFunctionDirs() {
    const dirListing = fs.readdirSync(".")
    const listOfDirs = dirListing.filter(path => fs.statSync(path).isDirectory())
    return listOfDirs.filter(path => fs.readdirSync(path).includes("app.ts"))
}

function ensureDirExists(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

function copyTemplates(funDirs) {
    funDirs.forEach(path => {
        fs.copyFileSync(`${path}/views/template.njk`, `${srcToBuild(path)}/template.njk`)
    })
}

function copyBaseTemplate(buildDirs) {
    buildDirs.forEach(path => {
        fs.copyFileSync("./templates/base.njk", `${path}/base.njk`)
    })
}

function copyGovuk(buildDirs) {
    buildDirs.forEach(path => {
        fs.cpSync(
            `build-deps/node_modules/govuk-frontend/govuk`,
            `${path}/govuk`,
            {recursive: true}
        )
    })
}

function srcToBuild(dirName) {
    return `./.aws-sam/build/${toPascalCase(dirName)}Function`
}

function toPascalCase(text) {
    return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text) {
    return text.replace(/-/, "").toUpperCase();
}