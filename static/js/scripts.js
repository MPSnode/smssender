document.getElementById('smsForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const response = await fetch('/send_sms', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    displayResults(result);
});

document.getElementById('balanceBtn').addEventListener('click', async function() {
    const accountSid = document.getElementById('account_sid').value;
    const authToken = document.getElementById('auth_token').value;
    if (accountSid && authToken) {
        const formData = new FormData();
        formData.append('account_sid', accountSid);
        formData.append('auth_token', authToken);
        const response = await fetch('/get_balance', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        displayBalanceInfo(result);
    } else {
        alert('Please enter Account SID and Auth Token');
    }
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'result';
        div.innerHTML = `
            <strong>Nomor:</strong> ${result.number} <br>
            <strong>Status:</strong> ${result.status} <br>
            ${result.message_id ? `<strong>ID Pesan:</strong> ${result.message_id}` : ''}
            ${result.error ? `<strong>Error:</strong> ${result.error}` : ''}
        `;
        resultsDiv.appendChild(div);
    });
}

function displayBalanceInfo(info) {
    const balanceInfoDiv = document.getElementById('balanceInfo');
    balanceInfoDiv.innerHTML = `
        <strong>Saldo:</strong> ${info.balance} ${info.currency} <br>
        <strong>Penggunaan Hari Ini:</strong> ${info.usage} SMS <br>
        <strong>Batas Penggunaan:</strong> ${info.limit} SMS
    `;
}
