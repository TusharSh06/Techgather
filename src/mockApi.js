// Mock API for testing authentication
// This simulates a backend API for development purposes

// Mock user database
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    id: 3,
    name: 'Event Organizer',
    email: 'organizer@example.com',
    password: 'organizer123',
    role: 'organizer'
  },
  {
    id: 4,
    name: 'Vendor User',
    email: 'vendor@example.com',
    password: 'vendor123',
    role: 'vendor'
  }
];

// Mock tokens (in a real app, these would be JWT tokens)
const tokens = {};

// Mock API functions
export const mockApi = {
  // Login with email or username
  login: async (email, password, role) => {
    console.log('Mock API login called with:', { email, role });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      console.log('User not found for email:', email);
      throw new Error('User not found');
    }

    // Check password
    if (user.password !== password) {
      console.log('Invalid password for user:', email);
      throw new Error('Invalid password');
    }

    // Check role
    if (role && user.role !== role) {
      console.log('Role mismatch:', { requested: role, actual: user.role });
      throw new Error(`You don't have permission to login as ${role}`);
    }

    console.log('Login successful for user:', email);
    return {
      token: 'mock-jwt-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  },
  
  // Register a new user
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData
    };
    mockUsers.push(newUser);

    return {
      token: 'mock-jwt-token',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  },
  
  // Get user profile
  getProfile: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token !== 'mock-jwt-token') {
      throw new Error('Invalid token');
    }

    const user = mockUsers[0]; // Just return the first user for mock purposes
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}; 