'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('Projects', 'name', {
			type: Sequelize.STRING,
			unique: false,
		});

		await queryInterface.changeColumn('Users', 'name', {
			type: Sequelize.STRING,
			unique: false,
		});

		await queryInterface.addColumn('Projects', 'slug', {
			type: Sequelize.STRING,
			allowNull: true,
		});

		await queryInterface.addColumn('Users', 'slug', {
			type: Sequelize.STRING,
			allowNull: true,
		});

		await queryInterface.sequelize.query(`
			UPDATE "Projects"
			SET slug = LOWER(REGEXP_REPLACE(name, '\\s+', '-', 'g'))
			WHERE slug IS NULL
		`);

		await queryInterface.sequelize.query(`
			UPDATE "Users"
			SET slug = LOWER(REGEXP_REPLACE(name, '\\s+', '-', 'g'))
			WHERE slug IS NULL
		`);

		await queryInterface.addConstraint('Projects', {
			fields: ['slug'],
			type: 'unique',
			name: 'projects_slug_unique',
		});

		await queryInterface.addConstraint('Users', {
			fields: ['slug'],
			type: 'unique',
			name: 'users_slug_unique',
		});

		await queryInterface.changeColumn('Projects', 'slug', {
			type: Sequelize.STRING,
			allowNull: false,
		});

		await queryInterface.changeColumn('Users', 'slug', {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeConstraint(
			'Projects',
			'projects_slug_unique',
		);
		await queryInterface.removeConstraint('Users', 'users_slug_unique');

		await queryInterface.removeColumn('Projects', 'slug');
		await queryInterface.removeColumn('Users', 'slug');
	},
};
