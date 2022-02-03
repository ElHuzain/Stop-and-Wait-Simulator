let tick = 0; // Distance/timer metric
let distance = 5; // Distance between S and R is 5 ticks
// Sender & Receiver classes
class senderC {
    constructor(){
        this.toBeSent = 0;
        this.timeOut = distance * 2;
        this.timer = distance;
        this.frameSent = false;
    }

    send(){
        this.timeOut = distance * 2;
        this.timer = distance;
        this.frameSent = true;
    }
    switch(){
        if(this.toBeSent == 1) this.toBeSent = 0;
        else this.toBeSent = 1;
    }
}
class receiverC{
    constructor(){
        this.expectedBit = 0 // Binary value indicating whether the received bit is correct or not.
        this.timer = distance;
        this.ACKSent = false;
    }

    store(bit){
        if(bit == this.expectedBit){
            if(this.expectedBit == 1) this.expectedBit = 0;
            else this.expectedBit = 1;
            this.sendACK();
            broadcast = `RECEIVER: Received correct bit. Sending ACK.`;
        } else {
            broadcast = "Received: Received incorrect frame. Sending NAK.";
            this.sendACK();
            // Negative acknowledgment here
        }
    }
    sendACK(){
        this.timer = distance;
        this.ACKSent = true;
    }
}
// Sender & Receiver objects
let sender = new senderC();
let receiver = new receiverC();
let broadcast = ""; // Message to be displayed
let colission = false;
let colissionChance = 3; // Chance of colission in percentage


function start(){
    handleFrames();
    let rndm = Math.random() * 100;
    if(rndm <= colissionChance){ // colission occurance
        colission = true;
        if(sender.frameSent == true) broadcast = "!!Frame Lost."
        else if(receiver.ACKSent == true) broadcast = "!!ACK Lost."
    }
    console.log(`[TICK ${tick++}] ${broadcast}`);
    broadcast = "";
}

setInterval(start, 500)

function handleFrames(){
    if(tick == 0) sender.send();
    if(sender.timer-- == 0 && sender.frameSent == true){
        if(colission == true){
            sender.frameSent = false;
            colission = false;
            //broadcast = "RECEIVER: Collission.";
        } else {
            receiver.store(sender.toBeSent);
            sender.frameSent = false;
        }
    }
    if(receiver.timer-- == 0 && receiver.ACKSent == true){
        if(colission == true){
            sender.frameSent = false;
            colission = false;
            //broadcast = "Collission. ACK not received.";
        } else {
            sender.switch();
            sender.send();
            receiver.ACKSent = false;
            broadcast = "SENDER: Received ACKNOWLEDGEMENT. Sending next bit."
        }
    }
    if(sender.timeOut-- == -1){
        broadcast = "SENDER: Timeout! Retransmitting..";
        sender.send();
    }
}

function deBug(){
    console.log(`S: ${sender.toBeSent}\nR: ${receiver.expectedBit}`)
}

