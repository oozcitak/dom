const { DOMParser } = require("../lib")
const { dom } = require("../lib/dom")
const { readFileSync } = require("fs")
const { join } = require("path")

const sampleFileName = join(__dirname, "./assets/sample-2MB.xml")
const xml = readFileSync(sampleFileName).toString()

dom.setFeatures(false)
const domParser = new DOMParser()
for (let i = 0; i < 100; i++) {
  domParser.parseFromString(xml, "application/xml")
}
