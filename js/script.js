/*

© abilash-dev | https://github.com/abilash-dev/qr-code-generator-and-scanner

*/

const form = document.getElementById('generate-form');
const qrcode = document.getElementById('qrcode');
const saveBtn = document.getElementById('save-btn');
const spinner = document.getElementById('spinner');
const resultBox = document.getElementById('scan-result-box');
const resultText = document.getElementById('scan-result');
const copyBtn = document.getElementById('copy-btn');
document.body.classList.toggle('dark');

function showResult(text) {
    resultText.value = text;
    resultBox.classList.remove('hidden');
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = document.getElementById('content').value;
    const size = document.getElementById('size').value;
    if (!content) return alert('Please enter content.');

    spinner.style.display = 'block';
    qrcode.innerHTML = '';
    setTimeout(() => {
        new QRCode(qrcode, { text: content, width: size, height: size });
        spinner.style.display = 'none';
        saveBtn.style.display = 'block';
    }, 500);
});

saveBtn.addEventListener('click', () => {
    const qrCanvas = document.querySelector('#qrcode canvas');
    const imgData = qrCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    const content = document.getElementById('content').value;
    link.href = imgData;
    link.download = `${content}-QR.png`;
    link.click();
});

const resultElem = document.getElementById('scan-result');
const html5QrCode = new Html5Qrcode("reader");
Html5Qrcode.getCameras().then(devices => {
    if (devices.length) {
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            qrCodeMessage => {
                resultElem.textContent = `Scanned: ${qrCodeMessage}`;
                html5QrCode.stop();
            },
            errorMsg => { }
        );
    }
});

document.getElementById('qr-upload').addEventListener('change', e => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    html5QrCode.scanFile(file, true)
        .then(decodedText => showResult(decodedText))
        .catch(err => showResult('Error scanning QR code.'));
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(resultText.value).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy Scanned Text", 2000);
    });
});  