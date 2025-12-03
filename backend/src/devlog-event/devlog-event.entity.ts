import {
	Table,
	Column,
	Model,
	DataType,
	Default,
	ForeignKey,
	BelongsTo
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Table
export class DevlogEvent extends Model {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		allowNull: false,
		primaryKey: true,
	})
	id: string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	userId: string;

	@BelongsTo(() => User)
	user: User;

	@ForeignKey(() => Project)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	projectId: string;

	@BelongsTo(() => Project)
	project: Project;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	summary: string;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	content: string;

	@Default(0)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	views: number;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	createdAt: Date;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	updatedAt: Date;
}

