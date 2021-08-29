const wbm = require('wbm');


export async function sendMsg(par) {
    await Promise.all
    let msg = par.toString()
    let number = '556784327928'
    wbm.start().then(async () => {
        const contacts = [
            { phone: number, name: msg }
        ];
        const message = '{{name}}';
        await wbm.send(contacts, message);
        await wbm.end();
    }).catch(err => console.log(err));    
};