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
    app.listen(port, () => console.log(`listening on port ${port}`));

};

init();