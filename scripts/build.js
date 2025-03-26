#!/usr/bin/env node
async function buildHTML() {}
async function buildPDF() {}
async function buildPNG() {}

function getExportFormats() {
  const validFormats = ['html', 'pdf', 'png']
  const argv = process.argv
  const lastArg = argv[argv.length-1]
  const format = lastArg.indexOf('=') < 0 ? lastArg : lastArg.split('=')[1]

}

getExportFormats()
