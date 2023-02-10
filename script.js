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