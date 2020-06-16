const Mealtypes = require('../models/meal_types.model.js');

class meal_typesController {
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
      const mealtypes = new Mealtypes(req.body);
      if (await mealtypes.nameAlreadyExists(mealtypes.name)) {
        res.status(400).send({
          errorMessage: 'An mealtypes with this name already exists !'
        });
      } else {
        const data = await mealtypes.create(mealtypes);
        res.status(201).send({ data });
      }
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while creating the mealtypes.'
      });
    }
  }

  static async findAll (req, res) {
    try {
      const data = (await Mealtypes.getAll())
        .map((i) => new Mealtypes(i))
        .map((i) => ({
          id: i.id,
          name: i.name
        }));
      res.send({ data });
    } catch (err) {
      res.status(500).send({
        errorMessage:
          err.message || 'Some error occurred while retrieving mealtypess.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Mealtypes.findById(req.params.id);
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `mealtypes with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error retrieving mealtypes with id ' + req.params.id
        });
      }
    }
  }

  static async update (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }

    try {
      const data = await Mealtypes.updateById(
        req.params.id,
        new Mealtypes(req.body)
      );
      res.send({ data });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `mealtypes with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Error updating mealtypes with id ' + req.params.id
        });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Mealtypes.remove(req.params.id);
      res.send({ message: 'mealtypes was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          errorMessage: `Not found mealtypes with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          errorMessage: 'Could not delete mealtypes with id ' + req.params.id
        });
      }
    }
  }
}

module.exports = meal_typesController;