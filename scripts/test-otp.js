const fetch = require('node-fetch');

async function test() {
  const base = 'http://localhost:3000/auth';

  // 1) Register (email with 111111 will auto-set otp to 111111)
  const registerRes = await fetch(`${base}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test+111111@example.com', password: 'password123', role: 'USER' })
  });
  const regJson = await registerRes.json();
  console.log('register response:', regJson);

  // 2) Verify OTP using 111111
  const verifyRes = await fetch(`${base}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test+111111@example.com', otp: '111111' })
  });
  const verJson = await verifyRes.json();
  console.log('verify response:', verJson);
}

test().catch(err => console.error(err));
