import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
	tableName: 'PostStatuses',
})
export class PostStatus extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		allowNull: false,
		primaryKey: true,
	})
	id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;
}
