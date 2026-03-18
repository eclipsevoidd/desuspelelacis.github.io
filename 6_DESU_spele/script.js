console.log("Skripts strādā");

const klase_X = 'x';
const klase_O = 'circle';

let xPunkti = 0;
let oPunkti = 0;
let double;

/*
0 1 2
3 4 5
6 7 8
*/

const uzvaras_nosacijumi = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const visi_laucini = document.querySelectorAll(".cell");
const rezultatu_logs = document.querySelector("#resultBox");
const rezultatu_teksts = document.querySelector("#resultInfo");
const atkartot = document.querySelector("#restartButton");
const atkartot2x = document.querySelector("#doubleButton");
const attelot_speletaju = document.querySelector("#display");
const atiestatit = document.querySelector("#resetButton");
const punkti_teksts = document.querySelector("#punktiInfo")

let speletajs_O = false;

atkartot2x.addEventListener("click", () => {
    double = true;
    location.reload();
})

visi_laucini.forEach(laucins => {
    laucins.addEventListener("click", veikt_gajienu, {once: true});
});

function zaudet_ar_taimeri() {
    if (!atiestatit.classList.contains("disableClick")) {
        const uzvaretajs = speletajs_O ? "X" : "O";
        
        let key = (uzvaretajs === "X" ? "xScore" : "oScore");
        let punkti = parseInt(localStorage.getItem(key) || 0) + 1;
        localStorage.setItem(key, punkti);

        rezultatu_teksts.innerHTML = `Laiks beidzās! Spēlētājs ${uzvaretajs} uzvarēja!`;
        rezultatu_logs.classList.add("show");
        
        visi_laucini.forEach(l => l.classList.add("disableClick"));
    }
    
}

let timeLimit; 
let myInterval;

function veikt_gajienu(klikskis) {
    const laucins = klikskis.target; // sapratīs, no kura lauciņa iegūts klikšķis (pārņem "click" eventu)
    const aktivais_speletajs = speletajs_O ? klase_O : klase_X;
    const body = document.body;

    let winDelay;

    if (speletajs_O) {
        body.classList.add("oPlayerBG");
        body.classList.remove("xPlayerBG");
    } else {
        body.classList.add("xPlayerBG");
        body.classList.remove("oPlayerBG");
    }

    laucins.classList.add(aktivais_speletajs);

    if (parbaudit_uzvaru(aktivais_speletajs)) {
        // punktu iestatīšana
        if (speletajs_O) {
            oPunkti = localStorage.getItem("oScore");
            if (!double) {
                oPunkti++;
            } else {
                oPunkti = oPunkti * 2;
                xPunkti = 0;
            }
            localStorage.setItem("oScore", oPunkti);
        } else {
            xPunkti = localStorage.getItem("xScore");
            if (!double) {
                xPunkti++;
            } else {
                xPunkti = xPunkti * 2;
                oPunkti = 0;
            }
            localStorage.setItem("xScore", xPunkti);
            double = false;
        }

        // localStorage.setItem(speletajs_O ? "oScore" : "xScore", speletajs_O ? oPunkti : xPunkti);

        rezultatu_teksts.innerHTML = `Spēlētājs ${speletajs_O ? "O" : "X"} uzvarēja! <br> X Punkti: ${localStorage.getItem("xScore")} <br> O Punkti: ${localStorage.getItem("oScore")}`;
        
        visi_laucini.forEach(laucins => {
            laucins.classList.add("disableClick");
            atiestatit.classList.add("disableClick");
        });

        winDelay = setTimeout(() =>{
            rezultatu_logs.classList.add("show");
        }, 1000)
    } else if (vai_ir_neizskirts()) {
        rezultatu_teksts.innerHTML = `Neizšķirts! <br> X Punkti: ${localStorage.getItem("xScore")} <br> O Punkti: ${localStorage.getItem("oScore")}`;

        visi_laucini.forEach(laucins => {
            laucins.classList.add("disableClick");
            atiestatit.classList.add("disableClick");
        });

        winDelay = setTimeout(() =>{
            rezultatu_logs.classList.add("show");
        }, 1000)
        
    } else {
        speletajs_O = !speletajs_O;
        attelot_speletaju.textContent = speletajs_O ? "O" : "X";
    }
}

function parbaudit_uzvaru(aktivais){
    for (let  i= 0; i < uzvaras_nosacijumi.length; i++) {
        const kombinacija = uzvaras_nosacijumi[i];
        const a = kombinacija[0];
        const b = kombinacija[1];
        const c = kombinacija[2];

        if (visi_laucini[a].classList.contains(aktivais) &&
            visi_laucini[b].classList.contains(aktivais) && 
            visi_laucini[c].classList.contains(aktivais)) {

                winLaucins1 = visi_laucini[a];
                winLaucins2 = visi_laucini[b];
                winLaucins3 = visi_laucini[c];

                winLaucins1.style.backgroundColor = "rgba(0, 255, 0, .2)";
                winLaucins2.style.backgroundColor = "rgba(0, 255, 0, .2)";
                winLaucins3.style.backgroundColor = "rgba(0, 255, 0, .2)";

                return true;
        }
    }
    return false;
}

function vai_ir_neizskirts() {
    for (let i = 0; i < visi_laucini.length; i++) {
        const laucins = visi_laucini[i];

        if (!laucins.classList.contains(klase_X) && !laucins.classList.contains(klase_O)) {
            return false;
        }
    }

    return true;
}



atkartot.addEventListener("click", () => {
    location.reload();
})

atiestatit.addEventListener("click", () => {
    let delay;

    localStorage.setItem("xScore", 0);
    localStorage.setItem("oScore", 0);

    atiestatit.textContent = "Dati atiestatīti!"

    delay = setTimeout(() =>{
        atiestatit.textContent = "Atiestatīt punktus"
    }, 1000)
})
