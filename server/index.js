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

app.use(express.json());
app.use(require('morgan')('dev'));

app.get('/api/users', async (req, res, next) => {
    try {
    res.send(await fetchUsers());
} catch (error) {
    next(error);
}
});

app.get('/api/products', async (req, res, next) => {
    try {
        res.send(await fetchProducts());
    } catch (error) {
        next(error);
    }
    });

app.get('/api/users/:id/favorites', async (req, res, next) => {
    try {
        res.send(await fetchFavorites(req.params.id));
    } catch (error) {
        next(error);
    }
});

app.post('/api/users/:id/favorites', async (req, res, next) => {
    try {
        res.status(201).send(await createFavorite({
            user_id : req.params.id,
            product_id : req.body.product_id,
        }));
    } catch (error) {
        next(error);
    }
});

app.delete('/api/users/:userId/favorites/:id', async (req, res, next) => {
    try {
        await deleteFavorite({id: req.params.id, user_id: req.params.user_Id});
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

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
    console.log('display all users', users);
    const products = await fetchProducts();
    console.log('display all products', products);

    const favorites = await Promise.all([
        createFavorite({user_id: nick.id, product_id: electronics.id}),
        createFavorite({user_id: nick.id, product_id: books.id}),
        createFavorite({user_id: sophia.id, product_id: books.id}),
        createFavorite({user_id: katherine.id, product_id: cooking.id})
    ]);

    console.log('nicks 2 favorites', await fetchFavorites(nick.id));

    await deleteFavorite({ user_id: nick.id, id: favorites[0].id});
    console.log('nicks 1 favorite', await fetchFavorites(nick.id));

    console.log(`curl localhost:3000/api/users/${nick.id}/favorites`);

    console.log(
      `curl -X POST localhost:3000/api/users/${nick.id}/favorites -d '{"product_id":"${cooking.id}"}' -H 'Content-Type:application/json'`
    );
  
    console.log(
      `curl -X DELETE localhost:3000/api/users/${nick.id}/favorites/${favorites[0].id}`
    );
  
    app.listen(port, () => console.log(`listening on port ${port}`));

};

init();