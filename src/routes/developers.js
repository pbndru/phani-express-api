const express = require('express');
const schema = require('../database/schema');
const databaseUrl = require('../database/connection');
const developers = databaseUrl.get('developers');

const router = express.Router();

/* Get all developers */
router.get('/', async (req, res, next) => {
  try {
    const alldevelopers = await developers.find({});
    res.json(alldevelopers);
  } catch (error) {
    next(error);
  }
});

/* Get a specific developer */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const developer = await developers.findOne({
      _id: id,
    });

    if (!developer) {
      const error = new Error('developer does not exist');
      return next(error);
    }

    res.json(developer);
  } catch (error) {
    next(error);
  }
});

/* Create a new developer */
router.post('/', async (req, res, next) => {
  try {
    const { name, title } = req.body;
    await schema.validateAsync({ name, title });

    const developer = await developers.findOne({
      name,
    });

    // developer already exists
    if (developer) {
      const error = new Error('developer already exists');
      res.status(409);
      return next(error);
    }

    const newdeveloper = await developers.insert({
      name,
      title,
    });

    res.status(201).json(newdeveloper);
  } catch (error) {
    next(error);
  }
});

/* Update a specific developer */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, title } = req.body;
    const result = await schema.validateAsync({ name, title });
    const developer = await developers.findOne({
      _id: id,
    });

    // developer does not exist
    if (!developer) {
      return next();
    }

    const updateddeveloper = await developers.update({
      _id: id,
    }, { $set: result },
    { upsert: true });

    res.json(updateddeveloper);
  } catch (error) {
    next(error);
  }
});

/* Delete a specific developer */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const developer = await developers.findOne({
      _id: id,
    });

    // developer does not exist
    if (!developer) {
      return next();
    }
    await developers.remove({
      _id: id,
    });

    res.json({
      message: 'developer has been deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;