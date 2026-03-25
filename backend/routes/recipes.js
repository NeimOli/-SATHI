import express from 'express';
import Recipe from '../models/Recipe.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      cuisine,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      onlyChefs = 'false'
    } = req.query;

    const filter = { isPublic: true };
    
    if (category) filter.category = category;
    if (cuisine) filter.cuisine = cuisine;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const recipes = await Recipe.find(filter)
      .populate({
        path: 'author',
        select: 'username profile.fullName profile.avatar userType',
        match: onlyChefs === 'true' ? { userType: 'restaurant' } : {}
      })
      .sort(sort);

    // Filter out recipes where author didn't match (if onlyChefs was true)
    const filteredResults = onlyChefs === 'true' 
      ? recipes.filter(r => r.author !== null)
      : recipes;

    const startIndex = (page - 1) * limit;
    const paginatedRecipes = filteredResults.slice(startIndex, startIndex + limit * 1);
    const totalCount = onlyChefs === 'true' ? filteredResults.length : await Recipe.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        recipes: paginatedRecipes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(totalCount / limit),
          total: totalCount
        }
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recipes'
    });
  }
});

// Get recipes by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const recipes = await Recipe.find({ author: userId })
      .populate('author', 'username profile.fullName profile.avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Recipe.countDocuments({ author: userId });

    res.json({
      status: 'success',
      data: {
        recipes,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get user recipes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user recipes'
    });
  }
});

// Get recipes by chef ID (for restaurant users)
router.get('/chef/:chefId', async (req, res) => {
  try {
    const { chefId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const recipes = await Recipe.find({ author: chefId })
      .populate('author', 'username profile.fullName profile.avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Recipe.countDocuments({ author: chefId });

    res.json({
      status: 'success',
      data: {
        recipes,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get chef recipes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch chef recipes'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username profile.fullName profile.avatar')
      .populate('reviews.user', 'username profile.fullName profile.avatar');

    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }

    res.json({
      status: 'success',
      data: { recipe }
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recipe'
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      author: req.user.userId
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();

    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.recipesCount': 1 }
    });

    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate('author', 'username profile.fullName profile.avatar');

    res.status(201).json({
      status: 'success',
      message: 'Recipe created successfully',
      data: { recipe: populatedRecipe }
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create recipe'
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }

    if (recipe.author.toString() !== req.user.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this recipe'
      });
    }

    Object.assign(recipe, req.body);
    await recipe.save();

    const updatedRecipe = await Recipe.findById(recipe._id)
      .populate('author', 'username profile.fullName profile.avatar');

    res.json({
      status: 'success',
      message: 'Recipe updated successfully',
      data: { recipe: updatedRecipe }
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update recipe'
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }

    if (recipe.author.toString() !== req.user.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this recipe'
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.recipesCount': -1 }
    });

    res.json({
      status: 'success',
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete recipe'
    });
  }
});

export default router;
