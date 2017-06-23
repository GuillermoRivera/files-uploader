'use strict'

const http = require('http')
const util = require('util')
const formidable = require('formidable')
const fse = require('fs-extra')
const fs = require('fs')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {

  if (req.method.toLocaleLowerCase() === 'get' && req.url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    fs.readFile('index.html', (err, data) => {
      if (err) throw err
      res.end(data)
    })
    /*res.end(`
      <h1>Files uploader with Node.JS</h1>
      <form action="/upload" enctype="multipart/form-data" method="post">
        <div>
          <input type="file" name="upload" required>
        </div>
        <div>
          <input type="submit" value="Upload">
        </div>
      </form>
    `)*/
  }

  if (req.method.toLowerCase() === 'post' && req.url === '/upload') {
    let form = new formidable.IncomingForm()

    form.encoding = 'utf-8'

    form.parse(req, (errors, fields, files) => {
      res.writeHead(200, {'content-type': 'text/html'})
      res.write(`
        <h1>Files received</h1>
        <br>
        <code>${util.inspect({ files: files })}</code>
        <br>
        <div>
          <a href="../">Regresar</a>
        </div>
      `)
      res.end()
    })
    form.on('progress', (bytesReceived, bytesExpected) => {
      let completed = (bytesReceived / bytesExpected) * 100
      console.log(`${completed.toFixed(2)}%`)
    })
    form.on('error', (error) => {
      console.log(err)
    })
    form.on('end', function (fields, files) {
      // Ubicación temporal del archivo que se sube
      let tempPath = this.openedFiles[0].path
      // Nombre del archivo subido
      let fileName = this.openedFiles[0].name
      // Nueva ubicación
      let newLocation = `./upload/${fileName}`

      fse.copy(tempPath, newLocation, err => {
        return (err) ? console.log(err) : console.log('Upload successful')
      })
    })

    return
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
