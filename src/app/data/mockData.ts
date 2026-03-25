// Mock data for the Bhansa Sathi community

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  recipesCount: number;
  followersCount: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookId: string;
  cookName: string;
  cookAvatar: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  tags: string[];
  likes: number;
  saves: number;
  comments: Comment[];
  createdAt: string;
  featured?: boolean;
  recipeOfWeek?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export const users: User[] = [
  {
    id: '1',
    name: 'Dristi Silwal',
    avatar: 'data:image/jpeg;base64,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',
    bio: 'Home cook passionate about traditional Nepali cuisine and sharing family recipes passed down through generations.',
    recipesCount: 24,
    followersCount: 1250,
  },
  {
    id: '2',
    name: 'Ramesh Gurung',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Love experimenting with fusion cooking. Bringing together flavors from around the world!',
    recipesCount: 18,
    followersCount: 890,
  },
  {
    id: '3',
    name: 'Maya Thapa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Dessert lover and baker. Making sweet moments sweeter, one recipe at a time.',
    recipesCount: 31,
    followersCount: 2100,
  },
  {
    id: '4',
    name: 'Bikash Rai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    bio: 'Quick and healthy recipes for busy professionals. Let\'s make cooking fun and easy!',
    recipesCount: 15,
    followersCount: 650,
  },
];

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Momo with Homemade Achar',
    description: 'Delicate steamed dumplings filled with spiced vegetables or chicken, served with a tangy and spicy tomato-sesame achar. A beloved Nepali comfort food that brings everyone together around the table!',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ5umoT_qIUux6H0wLu1jb5LzdpWyEjqcM1v3ofly_77ZeurECB3sAw88&s',
    cookId: '1',
    cookName: 'Dristi Silwal',
    cookAvatar: 'https://secure.b8cdn.com/images/uploads/user_photos/60/60371060_20210815050302.jpg',
    prepTime: '45 min',
    cookTime: '20 min',
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '2 cups all-purpose flour',
      '1/2 cup water',
      '300g ground chicken or mixed vegetables',
      '1 onion, finely chopped',
      '2 cloves garlic, minced',
      '1 tsp ginger paste',
      'Salt and pepper to taste',
      'For achar: 3 tomatoes, 2 tbsp sesame seeds, 2 green chilies, coriander',
    ],
    instructions: [
      'Make the dough by mixing flour and water. Knead until smooth and let rest for 30 minutes.',
      'Prepare the filling by mixing meat/vegetables with onion, garlic, ginger, salt, and pepper.',
      'Roll out small circles from the dough and place filling in the center.',
      'Fold and seal the edges to create pleated dumplings.',
      'Steam the momos for 15-20 minutes until cooked through.',
      'For achar: Roast tomatoes and sesame seeds, blend with chilies and coriander.',
      'Serve hot momos with the tangy achar!',
    ],
    tags: ['Nepali', 'Dumplings', 'Street Food', 'Comfort Food'],
    likes: 342,
    saves: 156,
    comments: [],
    createdAt: '2026-02-14T10:30:00Z',
    featured: true,
    recipeOfWeek: true,
  },
  {
    id: '2',
    title: 'Chicken Curry with Coconut Milk',
    description: 'Rich and aromatic curry that fills your home with warmth. Tender chicken simmered in a creamy coconut sauce with aromatic spices - perfect for a cozy family dinner!',
    image: 'https://images.unsplash.com/photo-1729824159986-376b49c6b7e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGFzaWFuJTIwY3Vycnl8ZW58MXx8fHwxNzcxMjEwNTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cookId: '2',
    cookName: 'Ramesh Gurung',
    cookAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    prepTime: '15 min',
    cookTime: '35 min',
    servings: 6,
    difficulty: 'Easy',
    ingredients: [
      '800g chicken pieces',
      '400ml coconut milk',
      '2 onions, sliced',
      '3 tomatoes, chopped',
      '2 tbsp curry powder',
      '1 tbsp garam masala',
      'Fresh coriander for garnish',
      'Salt to taste',
    ],
    instructions: [
      'Heat oil in a large pot and sauté onions until golden.',
      'Add curry powder and garam masala, cook for 1 minute.',
      'Add chicken pieces and brown on all sides.',
      'Stir in tomatoes and cook until softened.',
      'Pour in coconut milk and simmer for 25-30 minutes.',
      'Season with salt and garnish with fresh coriander.',
      'Serve with rice or naan bread!',
    ],
    tags: ['Curry', 'Chicken', 'Coconut', 'Easy'],
    likes: 289,
    saves: 201,
    comments: [],
    createdAt: '2026-02-13T14:20:00Z',
    featured: true,
  },
  {
    id: '3',
    title: 'Garden Fresh Vegetable Stir-Fry',
    description: 'A vibrant, colorful stir-fry bursting with fresh garden vegetables. Quick, healthy, and so delicious - this is how you fall in love with eating your veggies!',
    image: 'https://images.unsplash.com/photo-1616632125404-33e2addbff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBjb29raW5nfGVufDF8fHx8MTc3MTE2NjI5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    cookId: '4',
    cookName: 'Bikash Rai',
    cookAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    prepTime: '10 min',
    cookTime: '10 min',
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '2 cups broccoli florets',
      '1 bell pepper, sliced',
      '1 carrot, julienned',
      '1 cup snap peas',
      '2 cloves garlic, minced',
      '2 tbsp soy sauce',
      '1 tbsp sesame oil',
      'Sesame seeds for garnish',
    ],
    instructions: [
      'Heat sesame oil in a wok or large pan over high heat.',
      'Add garlic and stir-fry for 30 seconds.',
      'Add all vegetables and stir-fry for 5-7 minutes.',
      'Pour in soy sauce and toss well.',
      'Cook for another 2-3 minutes until vegetables are tender-crisp.',
      'Garnish with sesame seeds and serve immediately!',
    ],
    tags: ['Vegetarian', 'Healthy', 'Quick', 'Stir-Fry'],
    likes: 198,
    saves: 142,
    comments: [],
    createdAt: '2026-02-12T09:15:00Z',
  },
  {
    id: '4',
    title: 'Classic Gulab Jamun',
    description: 'Soft, melt-in-your-mouth sweet dumplings soaked in fragrant sugar syrup. This traditional dessert is pure love on a plate - perfect for celebrations or just because you deserve something sweet!',
    image: 'https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGRlc3NlcnQlMjBwYXN0cnl8ZW58MXx8fHwxNzcxMjEwNTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cookId: '3',
    cookName: 'Maya Thapa',
    cookAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    prepTime: '20 min',
    cookTime: '30 min',
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      '1 cup milk powder',
      '1/4 cup all-purpose flour',
      '1/4 tsp baking soda',
      '3 tbsp ghee',
      'Milk as needed',
      '2 cups sugar',
      '2 cups water',
      'Cardamom pods and saffron',
    ],
    instructions: [
      'Mix milk powder, flour, and baking soda in a bowl.',
      'Add ghee and enough milk to form a soft dough.',
      'Shape into small smooth balls.',
      'Heat sugar and water to make syrup, add cardamom and saffron.',
      'Deep fry the balls in medium heat until golden brown.',
      'Soak the fried balls in warm syrup for at least 2 hours.',
      'Serve warm or at room temperature!',
    ],
    tags: ['Dessert', 'Traditional', 'Sweet', 'Indian'],
    likes: 421,
    saves: 287,
    comments: [],
    createdAt: '2026-02-11T16:45:00Z',
    featured: true,
  },
  {
    id: '5',
    title: 'Dal Bhat - The Heart of Nepal',
    description: 'The soul-warming comfort food that nourishes body and spirit. Creamy lentil curry served with fluffy rice - this is home on a plate for millions. Simple, wholesome, and absolutely delicious!',
    image: 'https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZGFsJTIwbmVwYWxpJTIwZm9vZHxlbnwxfHx8fDE3NzEyMTA1MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cookId: '1',
    cookName: 'Dristi Silwal',
    cookAvatar: 'data:image/jpeg;base64,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',
    prepTime: '10 min',
    cookTime: '30 min',
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '1 cup red lentils',
      '2 cups rice',
      '1 onion, chopped',
      '2 tomatoes, chopped',
      '2 cloves garlic',
      '1 tsp turmeric',
      '1 tsp cumin seeds',
      'Fresh coriander',
      'Salt to taste',
    ],
    instructions: [
      'Rinse lentils and cook with water and turmeric until soft.',
      'Cook rice separately until fluffy.',
      'Heat oil and add cumin seeds, let them splutter.',
      'Add onion and garlic, sauté until golden.',
      'Add tomatoes and cook until soft.',
      'Mix this tempering into the cooked dal.',
      'Serve hot dal over rice with fresh coriander!',
    ],
    tags: ['Nepali', 'Comfort Food', 'Lentils', 'Traditional'],
    likes: 512,
    saves: 389,
    comments: [],
    createdAt: '2026-02-10T11:30:00Z',
  },
  {
    id: '6',
    title: 'Spicy Aloo Chop',
    description: 'Crispy on the outside, soft and spicy on the inside! These golden potato fritters are the perfect tea-time snack. Watch them disappear as soon as they hit the plate!',
    image: 'data:image/jpeg;base64,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',
    cookId: '2',
    cookName: 'Ramesh Gurung',
    cookAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '4 large potatoes, boiled and mashed',
      '1 onion, finely chopped',
      '2 green chilies, chopped',
      '1 tsp ginger paste',
      'Coriander leaves',
      'Breadcrumbs for coating',
      '1 egg, beaten',
      'Oil for deep frying',
    ],
    instructions: [
      'Mix mashed potatoes with onion, chilies, ginger, and coriander.',
      'Season with salt and mix well.',
      'Shape mixture into round patties.',
      'Dip each patty in beaten egg, then coat with breadcrumbs.',
      'Deep fry until golden and crispy.',
      'Serve hot with ketchup or chutney!',
    ],
    tags: ['Snack', 'Potato', 'Crispy', 'Tea Time'],
    likes: 267,
    saves: 178,
    comments: [],
    createdAt: '2026-02-09T15:20:00Z',
  },
];

// Add some sample comments
recipes[0].comments = [
  {
    id: 'c1',
    userId: '2',
    userName: 'Ramesh Gurung',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    text: 'Made these yesterday and my whole family loved them! The achar recipe is spot on. Thank you for sharing!',
    createdAt: '2026-02-15T08:15:00Z',
  },
  {
    id: 'c2',
    userId: '3',
    userName: 'Maya Thapa',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    text: 'Such clear instructions! Even as a beginner, I managed to make perfect momos. Can\'t wait to try more of your recipes!',
    createdAt: '2026-02-15T12:30:00Z',
  },
];

recipes[1].comments = [
  {
    id: 'c3',
    userId: '4',
    userName: 'Bikash Rai',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    text: 'This is now my go-to curry recipe! So easy and absolutely delicious.',
    createdAt: '2026-02-14T19:45:00Z',
  },
];
