'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('sections', [
      // Sections for Post ID 1
      {
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel eros quis felis feugiat sollicitudin. Duis commodo risus a neque interdum, nec tincidunt elit eleifend. Proin vulputate velit a odio ullamcorper, nec vehicula magna rutrum. Phasellus commodo, dui quis mattis fringilla, nisi libero lacinia orci, id scelerisque justo risus vitae tortor. Donec ut diam ut lacus fermentum varius. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec eu erat non magna lacinia rhoncus. Integer id justo sed enim dignissim luctus. Proin varius auctor nisi, vel molestie purus auctor a. Nam vel vestibulum turpis.`,
        title: 'Introduction',
        media: 'intro-quantum-physics.jpg',
        mediaType: 'image',
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: `Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla in nisl ut odio eleifend vestibulum. Donec non pretium ipsum. Integer eleifend feugiat tincidunt. Nullam id mi non arcu consequat mollis. Mauris nec leo vel nisi elementum luctus. Sed congue, odio a posuere accumsan, libero augue gravida ligula, et auctor augue felis id est. Mauris ac metus ullamcorper, eleifend velit id, laoreet erat. Duis in leo elit. Integer sit amet ultricies lorem, id lobortis mi. Nam volutpat semper elit, vel tincidunt tellus congue non. Sed id dui elit. Morbi vel libero ultrices, congue justo ut, posuere nulla. Proin eu pellentesque orci.`,
        title: 'Basics',
        media: 'basics-quantum-mechanics.pdf',
        mediaType: 'document',
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: `Sed scelerisque metus nec ante congue, id auctor orci aliquet. Integer scelerisque justo nec sapien luctus, at luctus magna scelerisque. In hac habitasse platea dictumst. Suspendisse potenti. Sed eu odio eu velit fermentum eleifend. Suspendisse potenti. Mauris vel quam in orci gravida dignissim in et nisl. Duis sollicitudin volutpat risus sit amet dictum. Vivamus in leo ut felis placerat convallis. Proin varius auctor ipsum, nec aliquam eros lacinia a.`,
        title: 'Entanglement',
        media: null,
        mediaType: null,
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sections for Post ID 2
      {
        content: `Nullam sit amet venenatis purus. Sed id quam eu dui ullamcorper laoreet. Nam fringilla lacinia erat, et scelerisque justo ullamcorper sed. Integer convallis nibh ac ante placerat, eget faucibus lorem feugiat. Quisque sit amet luctus risus. Vestibulum euismod, eros id posuere varius, erat nunc luctus est, non fermentum enim elit nec eros. Nam ac felis vitae eros scelerisque vestibulum nec ac augue. Cras condimentum nunc id tellus convallis, eget ullamcorper mi efficitur. Quisque ultricies nisi ac lorem iaculis, eget bibendum ipsum tempor.`,
        title: 'Overview',
        media: 'amazon-rainforest-overview.jpg',
        mediaType: 'image',
        postId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: `Praesent laoreet nibh sed urna tincidunt, et maximus elit consectetur. Morbi sem nisi, suscipit sit amet dictum nec, molestie vel risus. Phasellus eget pharetra eros. Aliquam ac orci sit amet dolor ultrices malesuada. Sed euismod felis quis tristique efficitur. Phasellus vitae convallis est. Morbi malesuada bibendum ligula, sit amet rutrum lectus ullamcorper a. Vivamus tristique, justo sed luctus lacinia, arcu dui lacinia elit, nec posuere mi justo nec nisl. Nullam efficitur tincidunt tortor, a vehicula tellus accumsan non. Suspendisse quis turpis nec nisl bibendum vestibulum sit amet eget purus.`,
        title: 'Wildlife',
        media: 'amazon-wildlife-guide.pdf',
        mediaType: 'document',
        postId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        content: `Integer tincidunt eros et urna fermentum, et consequat neque tristique. Sed placerat purus vitae augue bibendum, nec fringilla lectus vehicula. Sed faucibus, lorem et vehicula aliquam, ante mauris tempor ex, vel convallis libero metus vel lectus. Donec a lacus ac augue ullamcorper suscipit. Sed sit amet commodo risus. Etiam auctor odio ac diam eleifend, id ultricies tortor malesuada. Nullam a ligula eget ante eleifend ultricies. Nulla facilisi. Nulla eu arcu ligula. Proin vitae condimentum erat. Donec vitae eleifend lorem.`,
        title: 'Adventures',
        media: null,
        mediaType: null,
        postId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Add more sections for other posts as needed

    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sections', null, {});
  }
};
