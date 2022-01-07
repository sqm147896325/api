// app/utils/createServer.js
const SSHClient = require('ssh2').Client
const utf8 = require('utf8')


const sshServer = (machineConfig, ctx) => {
    const ssh = new SSHClient();
    const { host, username, password } = machineConfig
    const { socket } = ctx

    // 连接成功
    ssh.on('ready', () => {

        socket.emit('res', '\r\n*** SSH CONNECTION SUCCESS ***\r\n')

        ssh.shell((err, stream) => {

            if (err) {
                return socket.send('\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
            }

            socket.on('res', (command) => {
                stream.write(command)
            })

            stream.on('data', (msg) => {
                socket.emit('res', utf8.decode(msg.toString('binary')))

            }).on('close',  () => {
                socket.emit('res', '连接已断开')
                ssh.end();
            });
        })

    }).on('close', () => {
        socket.emit('res', '\r\n*** SSH CONNECTION CLOSED ***\r\n')
    }).on('error', (err) => {
        socket.emit('res', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n')
    }).connect({
        port: 22,
        host,
        username,
        password
    })
}

module.exports = sshServer