const wbm = require('wbm');



    const sendMsg = async function sendMsg(par) {
        let msg = par.toString()
        let number = ''
        wbm.start().then(async () => {
            const contacts = [
                { phone: number, name: msg }
            ];
            const message = '{{name}}';
            await wbm.send(contacts, message);
            await wbm.end();
        }).catch(err => console.log(err));    
    };

    exports.sendMsg = sendMsg