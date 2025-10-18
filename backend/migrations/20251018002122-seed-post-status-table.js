'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('PostStatuses', [
			{ id: uuidv4(), name: 'APPROVED' },
			{ id: uuidv4(), name: 'REJECTED' },
			{ id: uuidv4(), name: 'PENDENT' },
		]);

		const [results] = await queryInterface.sequelize.query(
			`SELECT id FROM "PostStatuses" WHERE name='PENDENT' LIMIT 1;`,
		);
		const pendentId = results[0].id;

		await queryInterface.addColumn('Posts', 'statusId', {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: pendentId,
			references: {
				model: 'PostStatuses',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Posts', 'statusId');

		await queryInterface.bulkDelete('PostStatuses', null, {});
	},
};
