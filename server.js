const http = require("http");
const fs = require("fs");


const server = http.createServer((req, res) => {

    if (!req.url.includes('favicon.ico')) {

        if (req.method == "POST") {

            let packet = "";

            req.on("data", (chunk) => {
                packet += chunk;
            })

            req.on("end", () => [

                fs.readFile("chat.json", "utf-8", (error, data) => {

                    if (!data) data = `{"messages":[]}`
                    packet = JSON.parse(packet);

                    data = JSON.parse(data);

                    data.messages.push({
                        "name": packet.name,
                        "message": packet.message,
                        "time": (new Date()).toLocaleDateString(),
                        "avatar": packet.avatar
                    });

                    fs.writeFile("chat.json", JSON.stringify(data), () => { })
                    res.end();

                })
            ]);

        } else if (req.url == "/") {

            fs.readFile("index.html", "utf-8", (err, data) => {

                res.setHeader('Content-Type', 'text/html');

                res.end(data);
            })

        } else if (req.url == "/chats") {

            fs.readFile("chat.json", "utf-8", (error, data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(data);

            });

            fs.readFile("chat.json", "utf-8", (error, data) => {

                if (!data) data = `{"messages":[]}`
                data = JSON.parse(data);

                data.messages.push({
                    "name": "ChatBOX Bot",
                    "message": req.socket.remoteAddress + " joined the chat.",
                    "time": (new Date()).toLocaleDateString(),
                    "avatar": "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                });

                fs.writeFile("chat.json", JSON.stringify(data), () => { });

            })
        } else if (req.url.includes("/id")) {

            const id = Number(req.url.slice(req.url.indexOf("=") + 1));

            fs.readFile("chat.json", "utf-8", (error, data) => {

                if (!data) data = `{"messages":[]}`

                data = JSON.parse(data).messages;

                if (data[id]) {

                    res.end(JSON.stringify({
                        "name": data[id].name,
                        "avatar": data[id].avatar,
                        "message": data[id].message,
                        "time": data[id].time

                    }));
                } else {

                    res.end(JSON.stringify({}));

                }
            })
        }
    } else {

        res.end("");
    }
});


server.listen(8888, () => {
    console.log("[+] Connection started at port:", 8888);
});


server.on("connection", () => {
    console.log("[+] New connection")
})
