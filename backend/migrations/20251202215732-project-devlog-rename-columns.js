'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('Posts', 'DevlogEvents');

    await queryInterface.removeColumn('DevlogEvents', 'title');
    await queryInterface.removeColumn('DevlogEvents', 'description');
    await queryInterface.removeColumn('DevlogEvents', 'previewImgUrl');
    await queryInterface.removeColumn('DevlogEvents', 'likesNumber');
    await queryInterface.removeColumn('DevlogEvents', 'slug');
    await queryInterface.removeColumn('DevlogEvents', 'comments');
    await queryInterface.removeColumn('DevlogEvents', 'category');
    await queryInterface.removeColumn('DevlogEvents', 'tags');
    await queryInterface.removeColumn('DevlogEvents', 'statusId');
    await queryInterface.removeColumn('DevlogEvents', 'likes');

    await queryInterface.addColumn('DevlogEvents', 'summary', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('DevlogEvents', 'content', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('DevlogEvents', 'projectId', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.addConstraint('DevlogEvents', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_devlogevents_user',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('DevlogEvents', {
      fields: ['projectId'],
      type: 'foreign key',
      name: 'fk_devlogevents_project',
      references: {
        table: 'Projects',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('DevlogEvents', 'fk_devlogevents_project');
    await queryInterface.removeConstraint('DevlogEvents', 'fk_devlogevents_user');

    await queryInterface.removeColumn('DevlogEvents', 'projectId');
    await queryInterface.removeColumn('DevlogEvents', 'summary');

    await queryInterface.changeColumn('DevlogEvents', 'content', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn('DevlogEvents', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('DevlogEvents', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });

    await queryInterface.addColumn('DevlogEvents', 'previewImgUrl', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/330px-Placeholder_view_vector.svg.png',
    });

    await queryInterface.addColumn('DevlogEvents', 'likesNumber', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('DevlogEvents', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn('DevlogEvents', 'comments', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });

    await queryInterface.addColumn('DevlogEvents', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('DevlogEvents', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });

    await queryInterface.addColumn('DevlogEvents', 'statusId', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: '07b329e6-b47b-4156-9e9c-89a34aa18fe1',
    });

    await queryInterface.renameTable('DevlogEvents', 'DevlogEvents');
  },
};

