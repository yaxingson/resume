#!/usr/bin/env node
"use strict"
import { writeFile, readFile } from 'node:fs/promises'
import puppeteer from 'puppeteer'
import { PDFDocument } from 'pdf-lib'
import pdfParse from 'pdf-parse'
import { port, hostname } from '../serve.js'

async function compressPDF() {
  const inputPdf = await readFile('./')
  const data = await pdfParse(inputPdf)

  const pdfDoc = await PDFDocument.create()
  const [ existingPage ] = await pdfDoc.embedPdf(inputPdf)

  const page = pdfDoc.addPage()

  page.drawPage(existingPage, {
    width: existingPage.width,
    height: existingPage.height,
    x:0,
    y:0
  })
  
  const compressedPdf = await pdfDoc.save({
    useObjectStreams: true,
    useCompression: true,
    // 移除元数据减小大小
    // removeDefaultPage: true
  })
  
  await writeFile(outputPath, compressedPdf)
}

async function buildPDF(compress=false) {
  const browser = await puppeteer.launch({ headless:true })
  const page = await browser.newPage()

  await page.goto(`http://${hostname}:${port}`, { waitUntil:'networkidle0' })
  await page.waitForSelector('#resume', { visible:true })

  const element = await page.$('#resume')
  const boundingBox = await element.boundingBox()

  await page.pdf({
    path:'',
    format:'A4',
    width: boundingBox.width,
    height: boundingBox.height + 10,
    printBackground:true,
    pageRanges:'2',
    clip:{
      x: boundingBox.x,
      y:boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height
    }
  })

  await browser.close()

  if(compress) compressPDF()
}

async function buildPNG() {
  const browser = await puppeteer.launch({ headless:true })
  const page = await browser.newPage()

  await page.goto(`http://${hostname}:${port}`, { waitUntil:'networkidle0' })
  await page.waitForSelector('#resume', { visible:true })

  const element = await page.$('#resume')
  
  await element.screenshot({
    path:'',
    type:'png',
    omitBackground:false,
    encoding:'base64'
  })

  await browser.close() 
}

function getExportFormats() {
  const validFormats = ['html', 'pdf', 'png']
  const argv = process.argv
  const lastArg = argv[argv.length-1]
  const format = lastArg.indexOf('=') < 0 ? lastArg : lastArg.split('=')[1]

}
