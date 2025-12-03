'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Projects', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
				allowNull: false,
				primaryKey: true,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: 'Users', key: 'id' },
				onDelete: 'CASCADE',
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			readme: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			stars: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()'),
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()'),
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('Projects');
	},
};
