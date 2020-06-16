const RecipeCategory = require('../models/recipes_category.model.js');

class RecipesCategoryController {
  static async create (req, res) {
    if (!req.body) {
      return res
        .status(400)
        .send({ errorMessage: 'Content can not be empty!' });
    }

    if (!req.body.name) {
      return res.status(400).send({ errorMessage: 'Name can not be empty!' });
    }

    try {
      const recipesCategory = new RecipeCategory(req.body);
      if (await RecipeCategory.nameAlreadyExists(recipesCategory.name)) {
        res.status(400).send({
          errorMessage: 'A RecipeCategory with this name already exists !'
        });
      } else {
        const data = await RecipeCategory.create(recipesCategory);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the RecipeCategory.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await RecipeCategory.getAll())
        .map((i) => new RecipeCategory(i))
        .map((i) => ({
          id: i.id,
          name: i.name
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving RecipeCategory.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await RecipeCategory.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `RecipeCategory with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving RecipeCategory with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await RecipeCategory.updateById(
        req.params.id,
        new RecipeCategory(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `RecipeCategory with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating RecipeCategory with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await RecipeCategory.remove(req.params.id);
      res.send({ message: 'RecipeCategory was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found RecipeCategory with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete RecipeCategory with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = RecipesCategoryController;
