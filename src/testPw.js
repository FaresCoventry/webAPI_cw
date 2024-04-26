const bcrypt = require('bcryptjs');

async function testHash() {
    const password = 'password';
    const hash = await bcrypt.hash(password, 8);
    console.log('Hash:', hash);

    const isMatch = await bcrypt.compare(password, hash);
    console.log('Password comparison result:', isMatch);
}

testHash();
