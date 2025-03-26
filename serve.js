import http from 'node:http'
import fs from 'node:fs/promises'
import pug from 'pug'
import { validate } from 'resume-schema'

const port = 5713
const hostname = 'localhost'

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
    const compileFunc = pug.compileFile('./index.pug')
    const { css, resume } = await getTemplateData(resumeJson)
    return compileFunc({
      css,
      resume
    })
  } catch(e) {
    return ''
  }
}

const devServer = http.createServer(async (req, res)=>{
  if(req.url === '/') {
    res.writeHead(200, {
      'content-type':'text/html; charset=utf-8'
    })
    res.end(await render())
  }
})

devServer.listen(port, hostname, ()=>{
  const now = new Date().toLocaleString()
  console.log(`[${now}] http://${hostname}:${port}`)
})
