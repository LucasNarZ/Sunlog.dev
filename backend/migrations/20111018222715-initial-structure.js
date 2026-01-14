'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Users
		await queryInterface.createTable(
			'Users',
			{
				id: {
					type: Sequelize.UUID,
					defaultValue: Sequelize.literal('gen_random_uuid()'),
					allowNull: false,
					primaryKey: true,
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true,
				},
				email: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true,
				},
				password: { type: Sequelize.STRING, allowNull: false },
				profileImgUrl: {
					type: Sequelize.TEXT,
					allowNull: false,
					defaultValue:
						'https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png',
				},
				followersNumber: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
				bio: {
					type: Sequelize.TEXT,
					allowNull: false,
					defaultValue: '',
				},
				createdAt: { type: Sequelize.DATE, allowNull: false },
				updatedAt: { type: Sequelize.DATE },
			},
			{ ifNotExists: true },
		);

		// Posts
		await queryInterface.createTable(
			'Posts',
			{
				id: {
					type: Sequelize.UUID,
					defaultValue: Sequelize.literal('gen_random_uuid()'),
					allowNull: false,
					primaryKey: true,
				},
				title: { type: Sequelize.STRING, allowNull: false },
				content: { type: Sequelize.TEXT, allowNull: false },
				description: {
					type: Sequelize.STRING,
					allowNull: false,
					defaultValue: '',
				},
				previewImgUrl: {
					type: Sequelize.TEXT,
					allowNull: false,
					defaultValue:
						'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/330px-Placeholder_view_vector.svg.png',
				},
				userId: {
					type: Sequelize.UUID,
					allowNull: false,
					references: { model: 'Users', key: 'id' },
					onDelete: 'CASCADE',
				},
				views: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
				likesNumber: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
				slug: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true,
				},
				comments: {
					type: Sequelize.ARRAY(Sequelize.STRING),
					allowNull: false,
					defaultValue: [],
				},
				category: { type: Sequelize.STRING, allowNull: false },
				tags: {
					type: Sequelize.ARRAY(Sequelize.STRING),
					allowNull: false,
					defaultValue: [],
				},
				createdAt: { type: Sequelize.DATE, allowNull: false },
				updatedAt: { type: Sequelize.DATE, allowNull: false },
			},
			{ ifNotExists: true },
		);

		// Follows
		await queryInterface.createTable(
			'Follows',
			{
				id: {
					type: Sequelize.UUID,
					defaultValue: Sequelize.literal('gen_random_uuid()'),
					allowNull: false,
					primaryKey: true,
				},
				followerId: {
					type: Sequelize.UUID,
					allowNull: false,
					references: { model: 'Users', key: 'id' },
					onDelete: 'CASCADE',
				},
				followedId: {
					type: Sequelize.UUID,
					allowNull: false,
					references: { model: 'Users', key: 'id' },
					onDelete: 'CASCADE',
				},
				createdAt: { type: Sequelize.DATE, allowNull: false },
			},
			{ ifNotExists: true },
		);

		// Likes
		await queryInterface.createTable(
			'Likes',
			{
				id: {
					type: Sequelize.UUID,
					defaultValue: Sequelize.literal('gen_random_uuid()'),
					allowNull: false,
					primaryKey: true,
				},
				likerId: {
					type: Sequelize.UUID,
					allowNull: false,
					references: { model: 'Users', key: 'id' },
					onDelete: 'CASCADE',
				},
				likedId: {
					type: Sequelize.UUID,
					allowNull: false,
					references: { model: 'Posts', key: 'id' },
					onDelete: 'CASCADE',
				},
				createdAt: { type: Sequelize.DATE, allowNull: false },
			},
			{ ifNotExists: true },
		);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('Likes');
		await queryInterface.dropTable('Follows');
		await queryInterface.dropTable('Posts');
		await queryInterface.dropTable('Users');
	},
};
