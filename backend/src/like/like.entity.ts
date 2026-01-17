import {
	DataType,
	Model,
	Table,
	Column,
	ForeignKey,
	CreatedAt,
} from 'sequelize-typescript';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';
import { User } from 'src/user/user.entity';

@Table({ timestamps: false })
export class Like extends Model {
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
	likerId: string;

	@ForeignKey(() => DevlogEvent)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	likedId: string;

	@CreatedAt
	@Column({ type: DataType.DATE, defaultValue: DataType.NOW })
	createdAt: Date;
}
