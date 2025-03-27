#!/usr/bin/env node
"use strict"
import http from 'node:http'
import fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import pug from 'pug'
import { fetchGithubData } from './utils.js'
import resumeSchema from './resume-schema.js'

export const port = 5713
export const hostname = 'localhost'

const mime_types = {
  'css':'text/css',
  'js':'text/javascript',
  'svg':'image/svg+xml',
  'png':'image/png',
  'ico':'image/vnd.microsoft.icon'
}

async function getTemplateData(resume) {
  const css = await fs.readFile('./theme/default.css', 'utf-8')
  const githubData = await fetchGithubData(resume.username)

  return {
    css:'',
    resume
  }
}

async function render() {
  try {
    const content = await fs.readFile('./resume.json', 'utf-8')
    const resumeJson = JSON.parse(content)
    const { error } = resumeSchema.validate(resumeJson)

    if(error) {
      throw new TypeError('resume schema validation failed!')
    }

    const compileFunc = pug.compileFile('./index.pug')
    const { css, resume } = await getTemplateData(resumeJson)

    return compileFunc({
      css,
      resume
    })
  } catch(e) {
    return { error:e.message || e }
  }
}

const devServer = http.createServer(async (req, res)=>{
  const { url } = req
  if(url === '/') {
    const data = await render()
    const hasError = typeof data !== 'string'

    res.writeHead(200, {
      'content-type': hasError ? 'application/json' : 'text/html'
    })
    
    res.end(hasError ? JSON.stringify(data) : data)
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
