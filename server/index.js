const { client,
    createTables,
    createProduct,
    createUser,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    deleteFavorite,
 } = require('./db');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const init = async () => {
    await client.connect();
    await createTables();
    console.log('created tables');

    const [nick, sophia, katherine, electronics, books, cooking] = await Promise.all([
        createUser({username: 'nick', password: 'secret'}),
        createUser({username: 'sophia', password: 'secret1'}),
        createUser({username: 'katherine', password: 'secret2'}),
        createProduct({name: 'electronics'}),
        createProduct({name: 'books'}),
        createProduct({name: 'cooking'})
    ]);

    const users = await fetchUsers();
    console.log(users);
    const products = await fetchProducts();
    console.log(products);

    // console.log(nick.id);
    // console.log(electronics.id);

    app.listen(port, () => console.log(`listening on port ${port}`));

};

init();