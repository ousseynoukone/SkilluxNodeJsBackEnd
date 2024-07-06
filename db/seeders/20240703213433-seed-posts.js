'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('posts', [
      {
        title: 'The Wonders of Quantum Physics',
        readNumber: 150,
        votesNumber: 30,
        isPublished: true,
        headerImage: 'quantum-physics-image-url',
        tags: ['science', 'physics', 'quantum'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Exploring the Amazon Rainforest',
        readNumber: 250,
        votesNumber: 50,
        isPublished: true,
        headerImage: 'amazon-rainforest-image-url',
        tags: ['travel', 'nature', 'adventure'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Understanding Buddhist Philosophy',
        readNumber: 120,
        votesNumber: 20,
        isPublished: true,
        headerImage: 'buddhist-philosophy-image-url',
        tags: ['religion', 'philosophy', 'buddhism'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Future of Space Travel',
        readNumber: 300,
        votesNumber: 80,
        isPublished: true,
        headerImage: 'space-travel-image-url',
        tags: ['science', 'space', 'technology'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'A Guide to Meditation Practices',
        readNumber: 180,
        votesNumber: 40,
        isPublished: false,
        headerImage: 'meditation-practices-image-url',
        tags: ['religion', 'health', 'wellbeing'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Top 10 Travel Destinations for 2024',
        readNumber: 400,
        votesNumber: 90,
        isPublished: true,
        headerImage: 'travel-destinations-2024-image-url',
        tags: ['travel', 'guide', '2024'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Introduction to Molecular Biology',
        readNumber: 220,
        votesNumber: 60,
        isPublished: true,
        headerImage: 'molecular-biology-image-url',
        tags: ['science', 'biology', 'molecular'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Spiritual Journey in Hinduism',
        readNumber: 130,
        votesNumber: 25,
        isPublished: false,
        headerImage: 'hinduism-journey-image-url',
        tags: ['religion', 'spirituality', 'hinduism'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Additional posts with userId 1, 2, or 3
      {
        title: 'Ancient Civilizations of Mesopotamia',
        readNumber: 180,
        votesNumber: 35,
        isPublished: true,
        headerImage: 'mesopotamia-civilizations-image-url',
        tags: ['history', 'civilization', 'ancient'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Artificial Intelligence in Healthcare',
        readNumber: 280,
        votesNumber: 55,
        isPublished: true,
        headerImage: 'ai-healthcare-image-url',
        tags: ['technology', 'healthcare', 'AI'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Deep Sea Exploration and Discoveries',
        readNumber: 190,
        votesNumber: 42,
        isPublished: true,
        headerImage: 'deep-sea-exploration-image-url',
        tags: ['science', 'exploration', 'ocean'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Renaissance Period in European History',
        readNumber: 320,
        votesNumber: 70,
        isPublished: true,
        headerImage: 'renaissance-europe-image-url',
        tags: ['history', 'renaissance', 'Europe'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Healthy Eating Habits for a Balanced Life',
        readNumber: 210,
        votesNumber: 48,
        isPublished: true,
        headerImage: 'healthy-eating-image-url',
        tags: ['health', 'nutrition', 'wellness'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Emerging Trends in Green Energy Technology',
        readNumber: 360,
        votesNumber: 75,
        isPublished: true,
        headerImage: 'green-energy-trends-image-url',
        tags: ['technology', 'environment', 'energy'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Ancient Greek Mythology and Legends',
        readNumber: 140,
        votesNumber: 28,
        isPublished: false,
        headerImage: 'greek-mythology-image-url',
        tags: ['history', 'mythology', 'Greece'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Space Exploration: Mars Colonization Plans',
        readNumber: 420,
        votesNumber: 95,
        isPublished: true,
        headerImage: 'mars-colonization-image-url',
        tags: ['space', 'exploration', 'Mars'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Art of Classical Music Appreciation',
        readNumber: 230,
        votesNumber: 52,
        isPublished: true,
        headerImage: 'classical-music-image-url',
        tags: ['music', 'classical', 'art'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Effective Time Management Strategies',
        readNumber: 280,
        votesNumber: 60,
        isPublished: true,
        headerImage: 'time-management-image-url',
        tags: ['productivity', 'management', 'strategy'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Beauty of Traditional Japanese Architecture',
        readNumber: 180,
        votesNumber: 40,
        isPublished: true,
        headerImage: 'japanese-architecture-image-url',
        tags: ['architecture', 'Japan', 'tradition'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Advancements in Quantum Computing',
        readNumber: 300,
        votesNumber: 65,
        isPublished: true,
        headerImage: 'quantum-computing-image-url',
        tags: ['technology', 'computing', 'quantum'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Exploring Ancient Egyptian Civilization',
        readNumber: 190,
        votesNumber: 38,
        isPublished: false,
        headerImage: 'egyptian-civilization-image-url',
        tags: ['history', 'Egypt', 'ancient'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Future of Robotics in Industry 4.0',
        readNumber: 360,
        votesNumber: 80,
        isPublished: true,
        headerImage: 'robotics-industry-image-url',
        tags: ['technology', 'robotics', 'industry'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Mindfulness Practices for Stress Reduction',
        readNumber: 240,
        votesNumber: 55,
        isPublished: true,
        headerImage: 'mindfulness-stress-reduction-image-url',
        tags: ['health', 'mindfulness', 'stress'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Ancient Roman Empire: Rise and Fall',
        readNumber: 130,
        votesNumber: 30,
        isPublished: true,
        headerImage: 'roman-empire-image-url',
        tags: ['history', 'Rome', 'ancient'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Innovations in Renewable Energy Sources',
        readNumber: 380,
        votesNumber: 70,
        isPublished: true,
        headerImage: 'renewable-energy-image-url',
        tags: ['technology', 'energy', 'environment'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Art of Public Speaking and Communication',
        readNumber: 260,
        votesNumber: 50,
        isPublished: true,
        headerImage: 'public-speaking-image-url',
        tags: ['communication', 'skills', 'public-speaking'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Ancient Mayan Civilization: Mysteries Revealed',
        readNumber: 170,
        votesNumber: 35,
        isPublished: false,
        headerImage: 'mayan-civilization-image-url',
        tags: ['history', 'Maya', 'ancient'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Cybersecurity Threats and Defense Strategies',
        readNumber: 320,
        votesNumber: 75,
        isPublished: true,
        headerImage: 'cybersecurity-image-url',
        tags: ['technology', 'security', 'cyber'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Healthy Lifestyle Habits for Longevity',
        readNumber: 280,
        votesNumber: 60,
        isPublished: true,
        headerImage: 'healthy-lifestyle-image-url',
        tags: ['health', 'lifestyle', 'longevity'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Impact of Globalization on Culture',
        readNumber: 150,
        votesNumber: 28,
        isPublished: true,
        headerImage: 'globalization-culture-image-url',
        tags: ['culture', 'globalization', 'impact'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Advancements in Virtual Reality Technology',
        readNumber: 340,
        votesNumber: 70,
        isPublished: true,
        headerImage: 'virtual-reality-image-url',
        tags: ['technology', 'VR', 'innovation'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Yoga and its Benefits for Mental Health',
        readNumber: 220,
        votesNumber: 45,
        isPublished: true,
        headerImage: 'yoga-mental-health-image-url',
        tags: ['health', 'yoga', 'mental-health'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Medieval European History: Key Events',
        readNumber: 190,
        votesNumber: 40,
        isPublished: false,
        headerImage: 'medieval-europe-history-image-url',
        tags: ['history', 'medieval', 'Europe'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Applications of Artificial Intelligence in Finance',
        readNumber: 380,
        votesNumber: 85,
        isPublished: true,
        headerImage: 'ai-finance-image-url',
        tags: ['finance', 'AI', 'technology'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Healthy Recipes for a Balanced Diet',
        readNumber: 260,
        votesNumber: 55,
        isPublished: true,
        headerImage: 'healthy-recipes-image-url',
        tags: ['health', 'recipes', 'nutrition'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Industrial Revolution and its Impact on Society',
        readNumber: 130,
        votesNumber: 28,
        isPublished: true,
        headerImage: 'industrial-revolution-image-url',
        tags: ['history', 'industrialization', 'society'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Future Trends in Biotechnology',
        readNumber: 320,
        votesNumber: 70,
        isPublished: true,
        headerImage: 'biotechnology-future-image-url',
        tags: ['science', 'biotech', 'future'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Mindfulness Meditation for Stress Relief',
        readNumber: 240,
        votesNumber: 50,
        isPublished: true,
        headerImage: 'mindfulness-meditation-image-url',
        tags: ['health', 'mindfulness', 'meditation'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Ancient Chinese Dynasties: History and Culture',
        readNumber: 180,
        votesNumber: 35,
        isPublished: false,
        headerImage: 'chinese-dynasties-image-url',
        tags: ['history', 'China', 'ancient'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Blockchain Technology and its Applications',
        readNumber: 360,
        votesNumber: 80,
        isPublished: true,
        headerImage: 'blockchain-technology-image-url',
        tags: ['technology', 'blockchain', 'applications'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Healthy Habits for Better Sleep',
        readNumber: 280,
        votesNumber: 60,
        isPublished: true,
        headerImage: 'healthy-sleep-image-url',
        tags: ['health', 'sleep', 'habits'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Impact of Climate Change on Global Ecosystems',
        readNumber: 150,
        votesNumber: 28,
        isPublished: true,
        headerImage: 'climate-change-ecosystems-image-url',
        tags: ['environment', 'climate', 'ecosystems'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Augmented Reality: Transforming User Experiences',
        readNumber: 340,
        votesNumber: 70,
        isPublished: true,
        headerImage: 'augmented-reality-image-url',
        tags: ['technology', 'AR', 'user-experiences'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Healthy Aging Tips for Longevity',
        readNumber: 220,
        votesNumber: 45,
        isPublished: true,
        headerImage: 'healthy-aging-image-url',
        tags: ['health', 'aging', 'longevity'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Renaissance Art: Beauty and Innovation',
        readNumber: 190,
        votesNumber: 40,
        isPublished: false,
        headerImage: 'renaissance-art-image-url',
        tags: ['art', 'Renaissance', 'innovation'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Challenges and Opportunities in Space Tourism',
        readNumber: 380,
        votesNumber: 85,
        isPublished: true,
        headerImage: 'space-tourism-image-url',
        tags: ['space', 'tourism', 'future'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Importance of Emotional Intelligence',
        readNumber: 260,
        votesNumber: 55,
        isPublished: true,
        headerImage: 'emotional-intelligence-image-url',
        tags: ['psychology', 'emotions', 'intelligence'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Ancient Aztec Civilization: Legends and Culture',
        readNumber: 130,
        votesNumber: 28,
        isPublished: true,
        headerImage: 'aztec-civilization-image-url',
        tags: ['history', 'Aztec', 'ancient'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Future Trends in Artificial Intelligence',
        readNumber: 320,
        votesNumber: 70,
        isPublished: true,
        headerImage: 'ai-future-trends-image-url',
        tags: ['technology', 'AI', 'future'],
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Stress Management Techniques for a Healthy Life',
        readNumber: 240,
        votesNumber: 50,
        isPublished: true,
        headerImage: 'stress-management-image-url',
        tags: ['health', 'stress', 'management'],
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
