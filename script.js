onDocumentReady(function() {
    let ip1 = document.getElementById("ip1")
    let ip2 = document.getElementById("ip2")
    let blocco = document.getElementById("blocco")
    let suddivisione = document.getElementById("suddivisione")
    let hostind = document.getElementById("hostind")
    let sottoreti = document.getElementById("sottoreti")

    ip1.oninput = () => calcola_bloccohostind()
    ip2.oninput = () => calcola_bloccohostind()
    suddivisione.oninput = () => calcola_hostind()

    function calcola_bloccohostind() {
        calcola_blocco()
        calcola_hostind()
    }

    function calcola_blocco() {
        let ip1_i = iptoint(ip1.value)
        let ip2_i = iptoint(ip2.value)
        if (!ip1_i || !ip2_i) return
        let z = ip1_i ^ ip2_i
        let k = 0
        while (z) {
            z >>= 1;
            k++;
        }
        blocco.value = inttoip(ip1_i >> k << k) + "/" + (32 - k)
    }

    function calcola_hostind() {
        let ip1_i = iptoint(ip1.value)
        let ip2_i = iptoint(ip2.value)
        if (!ip1_i || !ip2_i || !suddivisione.value) return
        let z = ip1_i ^ ip2_i
        let k = 0
        while (z) {
            z >>= 1;
            k++;
        }

        let bitsottoreti = Math.ceil(Math.log2(suddivisione.value))
        hostind.value = Math.pow(2, k - bitsottoreti)

        let base = ip1_i >> k << k
        let result = []
        for (let i = 0; i < suddivisione.value; i++) {
            let input = document.createElement("input")
            input.readOnly = true
            input.value = inttoip(base) + "/" + (32 - k + bitsottoreti)
            base += parseInt(hostind.value)
            result.push(input)
            if (i != suddivisione.value - 1) result.push(document.createElement("br"))
        }
        sottoreti.replaceChildren(...result)
    }

    //

    let L = document.getElementById("L")
    let MSS = document.getElementById("MSS")
    let nseg = document.getElementById("n_seg")

    L.oninput = () => calcola_nseg()
    MSS.oninput = () => calcola_nseg()

    function calcola_nseg() {
        if (!L.value || !MSS.value) return
        nseg.value = Math.ceil(L.value * Math.pow(2,20) / MSS.value)
    }

    //

    let v = document.getElementById("v")
    let K = document.getElementById("K")
    let t5 = document.getElementById("t5")

    v.oninput = () => calcola_t5()
    K.oninput = () => calcola_t5()

    function calcola_t5() {
        if (!v.value || !K.value) return
        t5.value = ((K.value * 512) + 96) / v.value
    }

    //
    
    let codicecdma1 = document.getElementById("codicecdma1")
    let codicecdma2 = document.getElementById("codicecdma2")
    let daticdma1 = document.getElementById("daticdma1")
    let daticdma2 = document.getElementById("daticdma2")
    let cdma = document.getElementById("cdma")

    codicecdma1.oninput = () => calcola_cdma()
    codicecdma2.oninput = () => calcola_cdma()
    daticdma1.oninput = () => calcola_cdma()
    daticdma2.oninput = () => calcola_cdma()

    function calcola_cdma() {
        if (!codicecdma1.value || !codicecdma2.value || !daticdma1.value || !daticdma2.value) return;
        let codice1 = codicecdma1.value.replace(/^\(|\)$/, "").split(/, */).map(b => parseInt(b))
        let codice2 = codicecdma2.value.replace(/^\(|\)$/, "").split(/, */).map(b => parseInt(b))
        let dati1 = daticdma1.value.replace(/^\(|\)$/, "").split(/, */).map(b => parseInt(b))
        let dati2 = daticdma2.value.replace(/^\(|\)$/, "").split(/, */).map(b => parseInt(b))
        let cdma1 = dati1.flatMap(bit => bit ? codice1 : codice1.map(b => -b))
        let cdma2 = dati2.flatMap(bit => bit ? codice2 : codice2.map(b => -b))
        console.log(codice1)
        console.log(codice2)
        console.log(dati1)
        console.log(dati2)
        cdma.value = cdma1.map((e, i) => e + cdma2[i]).join(", ")
    }

    //

    let n1 = document.getElementById("n1")
    let n2 = document.getElementById("n2")
    let n1n2 = document.getElementById("n1n2")

    n1.oninput = () => calcola_n1n2()
    n2.oninput = () => calcola_n1n2()

    function calcola_n1n2() {
        if (!n1.value || !n2.value) return
        n1n2.value = n2.value - n1.value
    }

    //

    let ncollisione = document.getElementById("ncollisione")
    let k = document.getElementById("k")
    let pk = document.getElementById("pk")

    ncollisione.oninput = () => calcola_pk()
    k.oninput = () => calcola_pk()

    function calcola_pk() {
        if (!ncollisione.value || !k.value) return
        if (k.value < 0 || k.value >= (1 << ncollisione.value)) pk.value = 0
        else pk.value = 1 / (1 << ncollisione.value)
    }

    //

    let MTU = document.getElementById("MTU")
    let nfram = document.getElementById("nfram")
    let offset = document.getElementById("offset")

    MTU.oninput = () => calcola_offset()
    nfram.oninput = () => calcola_offset()

    function calcola_offset() {
        if (!MTU.value || !nfram.value) return
        offset.value = (parseInt(MTU.value) * (nfram.value - 1) - 20 * (nfram.value - 1)) / 8
    }

    //

    let alohaN = document.getElementById("alohaN")
    let alohap = document.getElementById("alohap")
    let alohapspecific = document.getElementById("alohapspecific")
    let alohapq = document.getElementById("alohapq")

    alohaN.oninput = () => calcola_alohapqs()
    alohap.oninput = () => calcola_alohapqs()

    function calcola_alohapqs() {
        if (!alohaN.value || !alohap.value) return
        alohapspecific.value = Math.round(alohap.value * Math.pow(1 - alohap.value, alohaN.value - 1) * 100000) / 100000
        alohapq.value = alohaN.value * alohapspecific.value
    }

    //

    let hdrL = document.getElementById("hdrL")
    let hdrMSS = document.getElementById("hdrMSS")
    let hdr = document.getElementById("hdr")
    let hdrS = document.getElementById("hdrS")
    let hdrtransf = document.getElementById("hdrtransf")

    hdrL.oninput = () => calcola_hdrtransf()
    hdrMSS.oninput = () => calcola_hdrtransf()
    hdr.oninput = () => calcola_hdrtransf()
    hdrS.oninput = () => calcola_hdrtransf()

    function calcola_hdrtransf() {
        if (!hdrL.value || !hdrMSS.value || !hdr.value || !hdrS.value) return
        let pacchetti = hdrL.value * Math.pow(2, 20) / hdrMSS.value
        let ltot = (pacchetti * hdr.value) + hdrL.value * Math.pow(2, 20)
        hdrtransf.value = ltot * 8 / (hdrS.value * 1000000)
    }

    //

    let RTTs = document.getElementById("RTTs")
    let RTTsthrogmedio = document.getElementById("RTTsthrogmedio")

    RTTs.oninput = () => calcola_RTTsthrogmedio()

    function calcola_RTTsthrogmedio() {
        if (!RTTs.value) return
        RTTsthrogmedio.value = (parseInt(RTTs.value) + 1) / 2
    }

    //

    let RTT12 = document.getElementById("RTT12")
    let RTTcasopeggiore = document.getElementById("RTTcasopeggiore")

    RTT12.oninput = () => calcola_RTTcasopeggiore()

    function calcola_RTTcasopeggiore() {
        if (!RTT12.value) return
        RTTcasopeggiore.value = RTT12.value * 2 - 1
    }

    //

    let F = document.getElementById("F")
    let peers = document.getElementById("peers")
    let us = document.getElementById("us")
    let di = document.getElementById("di")
    let ui = document.getElementById("ui")
    let tdistcs = document.getElementById("tdistcs")
    let tdistpp = document.getElementById("tdistpp")

    F.oninput = () => calcola_tdist()
    peers.oninput = () => calcola_tdist()
    us.oninput = () => calcola_tdist()
    di.oninput = () => calcola_tdist()
    ui.oninput = () => calcola_tdist()

    function calcola_tdist() {
        if (!F.value || !peers.value || !us.value || !di.value || !ui.value) return
        let FF = F.value * 8000
        tdistcs.value = Math.max(peers.value * FF / us.value, FF / di.value)
        tdistpp.value = Math.round(Math.max(FF / us.value, FF / di.value, peers.value * FF / (parseInt(us.value) + parseInt(peers.value) * ui.value)) * 100) / 100
    }

    //

    //

    let L16 = document.getElementById("L16")
    let es16 = document.getElementById("es16")

    L16.oninput = () => calcola_es16()

    function calcola_es16() {
        if (!L16.value) return
        es16.value = Math.floor(L16.value / 2)
    }

    //

    let CRCseq = document.getElementById("CRCseq")
    let G = document.getElementById("G")
    let senzaCRC = document.getElementById("senzaCRC")

    CRCseq.oninput = () => calcola_senzaCRC()
    G.oninput = () => calcola_senzaCRC()


    function calcola_senzaCRC() {
        if (!CRCseq.value || !G.value) return
        let crc = CRCseq.value.toString()
        senzaCRC.value = crc.substring(0, crc.length - G.value.toString().length + 1)
    }

    //

    let checksumvalori = document.getElementById("checksumvalori")
    let checksumbit = document.getElementById("checksumbit")
    let checksum = document.getElementById("checksum")

    checksumvalori.oninput = () => calcola_checksum()
    checksumbit.oninput = () => calcola_checksum()

    function calcola_checksum() {
        if (!checksumvalori.value || !checksumbit.value) return
        checksum.value = (~checksumvalori.value.trim().split(/, */).map(n => parseInt(n, 2)).reduce((a, b) => a + b, 0) >>> 0).toString(2).substring(32 - checksumbit.value)
    }

    //

    let CDMAc = document.getElementById("CDMAc")
    let CDMAsegnale = document.getElementById("CDMAsegnale")
    let CDMAdec = document.getElementById("CDMAdec")

    CDMAc.oninput = () => calcola_CDMAdec()
    CDMAsegnale.oninput = () => calcola_CDMAdec()

    function calcola_CDMAdec() {
        if (!CDMAc.value || !CDMAsegnale.value) return
        let codice = CDMAc.value.replace(/^\(|\)$/, "").split(/, */).map(b => parseInt(b))
        let dati = CDMAsegnale.value.replace(/^\(|\)$/, "").split(/, */).map(b => parseInt(b))
        let moltiplicati = []
        for (let i = 0; i < dati.length; i++) {
            moltiplicati.push(dati[i] * codice[i % codice.length])
        }
        let res = []
        for (let i = 0; i < moltiplicati.length / codice.length; i++) {
            let somma = 0
            for (let j = 0; j < codice.length; j++) {
                somma += moltiplicati[i * codice.length + j]
            }
            res.push(somma)
        }
        CDMAdec.value = "(" + res.map(x => x / Math.abs(x)).join(",") + ")"
    }

    //

    let velocita1 = document.getElementById("velocita1")
    let velocita2 = document.getElementById("velocita2")
    let velocita3 = document.getElementById("velocita3")
    let throughputcm = document.getElementById("throughputcm")
    let filedim = document.getElementById("filedim")
    let ttrasfile = document.getElementById("ttrasfile")

    velocita1.oninput = () => calcola_throughputcm()
    velocita2.oninput = () => calcola_throughputcm()
    velocita3.oninput = () => calcola_throughputcm()
    filedim.oninput = () => calcola_throughputcm()

    function calcola_throughputcm() {
        if (!velocita1.value || !velocita2.value || !velocita3.value) return
        let v1 = velocita1.value
        let v2 = velocita2.value
        let v3 = velocita3.value
        throughputcm.value = Math.min(v1/6, v2/3, v3)
        if (!filedim.value) return
        ttrasfile.value = filedim.value * 8 / throughputcm.value
    }
})

function iptoint(ip) {
    let parts = ip.trim().split(".")
    if (parts.length != 4) return
    let ris = parseInt(parts[0]) * 256 * 256 * 256 + parseInt(parts[1]) * 256 * 256 + parseInt(parts[2]) * 256 + parseInt(parts[3])
    return ris
}

function inttoip(int) {
    let result = [];
    for (let i = 0; i < 4; i++) {
      result.unshift(int & 255);
      int = int >> 8;
    }
    return result.join(".");
}

function onDocumentReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}    