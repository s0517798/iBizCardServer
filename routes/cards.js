'use strict';

const serverless = require('serverless-http');
const express = require('express');

const { Card } = require('../models/card');
const { cardValidation } = require('../models/card');
const auth = require('../middleware/auth');

const router = express.Router();



// Create card
router.post('/', auth, async (req, res) => {
  
  const { error } = cardValidation(req.body)
  if(error) {
    return res.status(400).send(error.details[0].message);
  }

  let card = await Card.findOne({ company: req.body.company });
  // check if user existed to reject or not
  if(card) {
    return res.status(400).send('Card company already created.')
  } else {
    // if(cardId.user.length > 0) return res.send('You can not have more than one card.')
    try {
      card = new Card({
        company: req.body.company,
        slogan: req.body.slogan,
        name: req.body.name,
        profession: req.body.profession,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        website: req.body.website,
      });
      // result to save the card
      const result = await card.save();
      res.send(result);
    } catch(ex) {
      console.log(ex.error.details[0].message);
    }
  }

  
  // console.log(result);
})


// Get all cards
router.get('/', async (req, res) => {
  try{
    const cards = await Card.find()
    res.send(cards)

  } catch(ex) {
    res.status(500).send('Something failed.')
  }
})


// Get one card
router.get('/:id', async (req, res) => {
  try{
    const card = await Card.findById(req.params.id)
    res.send(card)

  } catch(ex) {
    res.status(500).send('Something failed.')
  }
})


// Update card
router.put('/:id', auth, async (req, res) => {
  try{
    const card = await Card.findByIdAndUpdate(req.params.id, {
      company: req.body.company,
      slogan: req.body.slogan,
      name: req.body.name,
      profession: req.body.profession,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      website: req.body.website,
    })
  
    res.send(card)

  } catch(ex) {
    res.status(500).send('Something failed.')
  }
})


// Detele a card
router.delete('/:id', auth, async (req, res) => {
  try{
    const card = await Card.findByIdAndRemove(req.params.id, {
    company: req.body.company,
    slogan: req.body.slogan,
    name: req.body.name,
    profession: req.body.profession,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    website: req.body.website,
  })
  
  res.send(card)
  } catch(ex) {
    res.status(500).send('Something failed.')
  }
})


module.exports.handler = router;