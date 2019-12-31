const { DOMParser } = require("../lib")
const { dom } = require("../lib/dom")
const { readFileSync } = require("fs")
const { join } = require("path")

const sampleFileName = join(__dirname, "./assets/sample.xml")
const xml = readFileSync(sampleFileName).toString()

dom.setFeatures(false)
const domParser = new DOMParser()
for (let i = 0; i < 1000; i++) {
  domParser.parseFromString(xml, "application/xml")
}
