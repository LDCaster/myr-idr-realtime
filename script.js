let currentRate = 0;
let isUpdating = false; // untuk mencegah loop event input

async function getRate() {
    const rateEl = document.getElementById("rate");
    const lastUpdateEl = document.getElementById("last-update");

    try {
        rateEl.textContent = "Memuat kurs...";
        const res = await fetch(
            "https://api.exchangerate-api.com/v4/latest/MYR"
        );
        if (!res.ok) throw new Error("Gagal menghubungi server");

        const data = await res.json();
        const rate = data.rates.IDR;
        const adjusted = rate * 0.99; // biaya konversi 1%
        currentRate = adjusted;

        rateEl.textContent = `≈ ${adjusted.toFixed(2)} IDR per 1 MYR`;

        const now = new Date();
        lastUpdateEl.textContent = `Terakhir diperbarui: ${now.toLocaleTimeString(
            "id-ID"
        )}`;

        // Update hasil kalkulator kalau ada input
        updateFromMYR();
        updateFromIDR();
    } catch (err) {
        rateEl.textContent = "Gagal mengambil data kurs.";
        lastUpdateEl.textContent = "";
        console.error(err);
    }
}

function updateFromMYR() {
    if (isUpdating) return;
    isUpdating = true;

    const inputMYR = document.getElementById("input-myr");
    const inputIDR = document.getElementById("input-idr");
    const resultIDR = document.getElementById("result-idr");

    const valMYR = parseFloat(inputMYR.value);
    if (!isNaN(valMYR) && valMYR >= 0 && currentRate > 0) {
        const idr = valMYR * currentRate;
        resultIDR.textContent = idr.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        });
        inputIDR.value = idr.toFixed(0);
    } else {
        resultIDR.textContent = "-";
        inputIDR.value = "";
    }

    isUpdating = false;
}

function updateFromIDR() {
    if (isUpdating) return;
    isUpdating = true;

    const inputMYR = document.getElementById("input-myr");
    const inputIDR = document.getElementById("input-idr");
    const resultMYR = document.getElementById("result-myr");

    const valIDR = parseFloat(inputIDR.value);
    if (!isNaN(valIDR) && valIDR >= 0 && currentRate > 0) {
        const myr = valIDR / currentRate;
        resultMYR.textContent = myr.toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        inputMYR.value = myr.toFixed(2);
    } else {
        resultMYR.textContent = "-";
        inputMYR.value = "";
    }

    isUpdating = false;
}

document
    .getElementById("input-myr")
    .addEventListener("input", updateFromMYR);
document
    .getElementById("input-idr")
    .addEventListener("input", updateFromIDR);

getRate();
setInterval(getRate, 60000);
