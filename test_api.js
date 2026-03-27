async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'failureconsultant', password: 'srifailure' })
        });
        const data = await res.json();
        console.log("Response:", data);
        
        // Also check server status
        const root = await fetch('http://localhost:5000/');
        console.log("Server Root Status:", root.status);
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}
test();
