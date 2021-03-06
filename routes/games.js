const express = require('express');
const router =  new express.Router();
const {Game} = require('./../models/game');

router.post('/', async(req, res) => {
    
    var perPage = 3;
    var page = req.body.page;
    let count;
    
    // String given in the search field
    var search_for_game = req.body.search_for || " ";

    // game selected in the filter
    const filter = req.body.filter;
    console.log(filter);
    console.log(search_for_game);

    // Find the games according to the filter and search
    let games;
    if(filter == "All"){
        count = await Game.count();
        games = await Game.find({name: new RegExp(req.body.search_for, 'i'),  show: true})
                           .skip((perPage * page) - perPage).limit(perPage);
    }
    else{
        games = await Game.find({ type: req.body.filter, name: new RegExp(req.body.search_for, 'i'),  show: true});
        count = games.length;
        games = await Game.find({ type: req.body.filter, name: new RegExp(req.body.search_for, 'i'),  show: true})
                            .skip((perPage * page) - perPage).limit(perPage);
    }
    // If the user is not logged-in
    if(!req.logged){
        // Not an admin
        res.locals.isAdmin = false;
    }
    // User is logged-in
    else{
        // Check if user isAdmin
        if(req.user.isAdmin){
            // Send to view that isAdmin is true
            res.locals.isAdmin = true;
        }
        else{
            // User not an admin
            res.locals.isAdmin = false;
        }

    }
    console.log('Hello');
    res.render('games',{games: games, current: page, pages: Math.ceil(count / perPage)});
    
})

module.exports = router;
