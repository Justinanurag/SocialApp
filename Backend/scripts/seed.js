import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Follow from '../models/Follow.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network';

/**
 * Seed script to populate database with sample data
 */
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Follow.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Software developer and tech enthusiast',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        experiences: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            startDate: new Date('2020-01-01'),
            current: true,
            description: 'Leading development of web applications'
          }
        ],
        education: [
          {
            school: 'Stanford University',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            startDate: new Date('2014-09-01'),
            endDate: new Date('2018-06-01'),
            current: false
          }
        ]
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
        bio: 'Designer and creative thinker',
        location: 'New York, NY',
        experiences: [
          {
            title: 'Product Designer',
            company: 'Design Studio',
            location: 'New York, NY',
            startDate: new Date('2019-03-01'),
            current: true
          }
        ],
        education: [
          {
            school: 'NYU',
            degree: 'Bachelor of Fine Arts',
            fieldOfStudy: 'Graphic Design',
            startDate: new Date('2015-09-01'),
            endDate: new Date('2019-05-01'),
            current: false
          }
        ]
      },
      {
        username: 'bobsmith',
        email: 'bob@example.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Smith',
        bio: 'Entrepreneur and startup founder',
        location: 'Austin, TX'
      },
      {
        username: 'alicejohnson',
        email: 'alice@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Johnson',
        bio: 'Data scientist and AI researcher',
        location: 'Seattle, WA'
      },
      {
        username: 'charliebrown',
        email: 'charlie@example.com',
        password: 'password123',
        firstName: 'Charlie',
        lastName: 'Brown',
        bio: 'Full-stack developer',
        location: 'Boston, MA'
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Create follow relationships
    await Follow.create([
      { follower: users[0]._id, following: users[1]._id },
      { follower: users[0]._id, following: users[2]._id },
      { follower: users[1]._id, following: users[0]._id },
      { follower: users[2]._id, following: users[0]._id },
      { follower: users[2]._id, following: users[1]._id },
      { follower: users[3]._id, following: users[0]._id },
      { follower: users[4]._id, following: users[0]._id }
    ]);

    // Update user followers/following arrays
    for (const follow of await Follow.find()) {
      await User.findByIdAndUpdate(follow.follower, {
        $addToSet: { following: follow.following }
      });
      await User.findByIdAndUpdate(follow.following, {
        $addToSet: { followers: follow.follower }
      });
    }

    console.log('Created follow relationships');

    // Create posts
    const posts = await Post.create([
      {
        user: users[0]._id,
        text: 'Just launched my new project! Excited to share it with everyone. 🚀',
        images: []
      },
      {
        user: users[1]._id,
        text: 'Beautiful sunset today! Nature never fails to inspire my designs.',
        images: []
      },
      {
        user: users[0]._id,
        text: 'Working on some exciting new features. Can\'t wait to show you all!',
        images: []
      },
      {
        user: users[2]._id,
        text: 'Starting a new venture. The journey begins now! 💼',
        images: []
      },
      {
        user: users[1]._id,
        text: 'Design is not just what it looks like - design is how it works.',
        images: []
      },
      {
        user: users[3]._id,
        text: 'Machine learning models are getting better every day. Fascinating times!',
        images: []
      },
      {
        user: users[4]._id,
        text: 'Code review done. Always learning something new from the team.',
        images: []
      },
      {
        user: users[0]._id,
        text: 'Thanks everyone for the amazing feedback on the latest release!',
        images: []
      }
    ]);

    console.log(`Created ${posts.length} posts`);

    // Add some likes and comments
    posts[0].likes.push({ user: users[1]._id });
    posts[0].likes.push({ user: users[2]._id });
    posts[0].comments.push({
      user: users[1]._id,
      text: 'Congratulations! This looks amazing!'
    });
    await posts[0].save();

    posts[1].likes.push({ user: users[0]._id });
    posts[1].likes.push({ user: users[2]._id });
    await posts[1].save();

    posts[2].likes.push({ user: users[1]._id });
    posts[2].comments.push({
      user: users[1]._id,
      text: 'Looking forward to seeing it!'
    });
    await posts[2].save();

    console.log('Added likes and comments');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nSample users:');
    console.log('  - john@example.com / password123');
    console.log('  - jane@example.com / password123');
    console.log('  - bob@example.com / password123');
    console.log('  - alice@example.com / password123');
    console.log('  - charlie@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

