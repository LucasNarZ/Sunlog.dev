'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Users', 'googleId', {
			type: Sequelize.STRING,
			allowNull: true,
			unique: true,
		});

		await queryInterface.changeColumn('Users', 'password', {
			type: Sequelize.STRING,
			allowNull: true,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Users', 'googleId');

		await queryInterface.changeColumn('Users', 'password', {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},
};
