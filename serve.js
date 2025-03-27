#!/usr/bin/env node
"use strict"
import http from 'node:http'
import fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { promisify } from 'node:util'
import pug from 'pug'
import { validate } from 'resume-schema'

const port = 5713
const hostname = 'localhost'

const mime_types = {
  'css':'text/css',
  'js':'text/javascript',
  'svg':'image/svg+xml',
  'png':'image/png',
  'ico':'image/vnd.microsoft.icon'
}

async function getTemplateData(resume) {
  const css = await fs.readFile('./theme/default.css', 'utf-8')

  return {
    css:'',
    resume
  }
}

async function render() {
  try {
    const content = await fs.readFile('./resume.json', 'utf-8')
    const resumeJson = JSON.parse(content)
    const result = await promisify(validate)(resumeJson)

    console.log(result)

    const compileFunc = pug.compileFile('./index.pug')
    const { css, resume } = await getTemplateData(resumeJson)
    
    return compileFunc({
      css,
      resume
    })
  } catch(e) {
    return JSON.stringify({
      error:e.message || e
    })
  }
}

const devServer = http.createServer(async (req, res)=>{
  const { url } = req
  if(url === '/') {
    res.writeHead(200, {
      'content-type':'text/html; charset=utf-8'
    })
    res.end(await render())
  } else {
    const ext = url.split('.')[1]
    res.writeHead(200, { 'content-type': mime_types[ext] })
    createReadStream(`./static${url}`).pipe(res)
  }
})

devServer.listen(port, hostname, ()=>{
  const now = new Date().toLocaleString()
  console.log(`[${now}] http://${hostname}:${port}`)
})
