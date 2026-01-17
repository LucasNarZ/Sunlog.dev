import {
	Table,
	Column,
	Model,
	DataType,
	Default,
	ForeignKey,
	BelongsTo,
	HasMany,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';

@Table
export class Project extends Model {
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

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true,
	})
	slug: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	description: string;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	readme: string;

	@Default(0)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	stars: number;

	@HasMany(() => DevlogEvent)
	devlogEvents: DevlogEvent[];

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
