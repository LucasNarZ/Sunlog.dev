'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
	async up(queryInterface, Sequelize) {
		const newPendingId = '07b329e6-b47b-4156-9e9c-89a34aa18fe1';

		await queryInterface.bulkInsert('PostStatuses', [
			{
				id: newPendingId,
				name: 'PENDENT',
			},
		]);

		const [oldPending] = await queryInterface.sequelize.query(
			`SELECT id FROM "PostStatuses" WHERE name = 'PENDENT' AND id != :id`,
			{ replacements: { id: newPendingId } },
		);

		if (oldPending.length === 0) {
			throw new Error('Nenhum status pending antigo encontrado');
		}

		const oldPendingId = oldPending[0].id;

		await queryInterface.sequelize.query(
			`
      UPDATE "Posts"
      SET "statusId" = :newId
      WHERE "statusId" = :oldId
    `,
			{ replacements: { newId: newPendingId, oldId: oldPendingId } },
		);

		await queryInterface.bulkDelete('PostStatuses', { id: oldPendingId });
	},

	async down(queryInterface, Sequelize) {
		const restoredId = uuidv4();

		await queryInterface.bulkInsert('PostStatuses', [
			{
				id: restoredId,
				name: 'PENDENT',
			},
		]);

		// Trocar de volta os posts
		const [currentPending] = await queryInterface.sequelize.query(
			`SELECT id FROM "PostStatuses" WHERE name = 'PENDENT' AND id != :id`,
			{ replacements: { id: restoredId } },
		);

		const currentId = currentPending[0].id;

		await queryInterface.sequelize.query(
			`
      UPDATE "Posts"
      SET "statusId" = :restoredId
      WHERE "statusId" = :currentId
    `,
			{ replacements: { restoredId, currentId } },
		);

		await queryInterface.bulkDelete('PostStatuses', { id: currentId });
	},
};
