import 'dotenv/config'
import { createServer, IncomingMessage, ServerResponse } from 'http';
 
 
const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  response.on('error', (err) => {
    console.error(err);
  });
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end('Hello world!');
});
 
server.listen(process.env.PORT);
console.log(`http://localhost:${process.env.PORT}`)