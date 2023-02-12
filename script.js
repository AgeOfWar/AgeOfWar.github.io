onDocumentReady(function() {
    let ip1 = document.getElementById("ip1")
    let ip2 = document.getElementById("ip2")
    let blocco = document.getElementById("blocco")

    ip1.oninput = () => calcola_blocco()
    ip2.oninput = () => calcola_blocco()

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
        tdistcs.value = Math.max(peers.value * F.value / us.value, F.value / di.value)
        tdistpp.value = Math.max(F.value / us.value, F.value * di.value, peers.value * F.value / (us.value + peers.value * ui.value))
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