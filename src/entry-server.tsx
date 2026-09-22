import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'node:stream'
import App from './App'

export function render() {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    let renderError: unknown

    const stream = renderToPipeableStream(<App />, {
      onAllReady() {
        const output = new Writable({
          write(chunk, _encoding, callback) {
            chunks.push(Buffer.from(chunk))
            callback()
          },
        })
        output.on('error', reject)
        output.on('finish', () => {
          if (renderError) reject(renderError)
          else resolve(Buffer.concat(chunks).toString('utf8'))
        })
        stream.pipe(output)
      },
      onShellError(error) {
        reject(error)
      },
      onError(error) {
        renderError = error
      },
    })
  })
}
