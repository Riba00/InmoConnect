import bcrypt from 'bcrypt';

const users = [
    {
        name: 'Ribadev',
        email: 'ribadev@gmail.com',
        is_confirmed: true,
        password: bcrypt.hashSync('123456', 10)
    },
];

export default users;