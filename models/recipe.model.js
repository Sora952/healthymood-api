const db = require('../db.js');

class Recipe {
  constructor (recipe) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.image = recipe.image;
    this.content = recipe.content;
    this.created_at = recipe.created_at;
    this.updated_at = recipe.updated_at;
    this.preparation_duration_seconds = recipe.preparation_duration_seconds;
    this.budget = recipe.budget;
    this.slug = recipe.slug;
    this.published = recipe.published;
    this.user_id = recipe.user_id;
    /*     this.calories = recipe.calories; */
  }

  static async create (newRecipe) {
    return db.query('INSERT INTO recipes SET ?', newRecipe).then((res) => {
      newRecipe.id = res.insertId;
      return newRecipe;
    });
  }

  static async findById (id) {
    return db.query('SELECT * FROM recipes WHERE id = ?', [id]).then((rows) => {
      if (rows.length) {
        return Promise.resolve(rows[0]);
      } else {
        const err = new Error();
        err.kind = 'not_found';
        return Promise.reject(err);
      }
    });
  }

  static async findBySlug (slug) {
    console.log(slug);
    return db
      .query('SELECT * FROM recipes WHERE slug = ?', [slug])
      .then((rows) => {
        console.log(rows);
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          const err = new Error();
          err.kind = 'not_found';
          return Promise.reject(err);
        }
      });
  }
  // eslint-disable-next-line
  static async getRecipeIngredients(recipe_id) {
    return db.query(
      'SELECT * FROM recipes LEFT JOIN recipe_ingredient_quantities riq ON recipes.id = riq.recipe_id JOIN ingredients ON ingredients.id = riq.ingredient_id WHERE recipe_id = ?',
      [recipe_id] // eslint-disable-line
    );
  }

  static async search (query) {
    console.log(query);
    const mealTypesID = query.meal_types ? query.meal_types.map(mealtype => parseInt(mealtype)) : null;
    const keyword = query.search ? `%${query.search}%` : null;
    const ingredientsID = query.ingredients ? query.ingredients.map(ingredient => parseInt(ingredient)) : null;
    const dietsID = query.diets ? query.diets.map(diet => parseInt(diet)) : null;
    console.log(keyword);
    console.log(mealTypesID);
    console.log(ingredientsID);
    console.log(dietsID);

    return db.query(
      'SELECT DISTINCT recipes.name, recipes.content, recipes.created_at, recipes.updated_at, recipes.preparation_duration_seconds, recipes.slug, recipes.published, recipes.user_id FROM recipes LEFT JOIN meal_type_recipes ON meal_type_recipes.recipe_id = recipes.id LEFT JOIN recipe_ingredient_quantities ON recipe_ingredient_quantities.recipe_id = recipes.id LEFT JOIN diet_recipes ON diet_recipes.recipe_id = recipes.id WHERE (? is NULL OR meal_type_recipes.meal_type_id IN (?))  AND (? is NULL OR recipe_ingredient_quantities.ingredient_id IN (?)) AND (? is NULL OR diet_recipes.diet_id IN (?)) AND (? is NULL OR recipes.name LIKE ? OR recipes.content LIKE ?)',
      [mealTypesID ? mealTypesID[0] : null, mealTypesID, ingredientsID ? ingredientsID[0] : null, ingredientsID, dietsID ? dietsID[0] : null, dietsID, keyword, keyword, keyword]
    ); //
  }

  static async getAll (result) {
    return db.query('SELECT * FROM recipes');
  }

  static async updateById (id, recipe) {
    return db
      .query(
        'UPDATE recipes SET name = ?, content = ?, image = ?, created_at = ?, updated_at = ?, preparation_duration_seconds = ?, budget = ?, slug = ?, published = ?, user_id = ?  WHERE id = ?',
        [
          recipe.name,
          recipe.content,
          recipe.image,
          // recipe.created_at,
          recipe.updated_at,
          recipe.preparation_duration_seconds,
          recipe.budget,
          recipe.slug,
          recipe.published,
          recipe.user_id,
          id
        ]
      )
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM recipes WHERE id = ?', id).then((res) => {
      if (res.affectedRows !== 0) {
        return Promise.resolve();
      } else {
        const err = new Error();
        err.kind = 'not_found';
        return Promise.reject(err);
      }
    });
  }

  static async removeAll (result) {
    return db.query('DELETE FROM recipes');
  }
}

module.exports = Recipe;
