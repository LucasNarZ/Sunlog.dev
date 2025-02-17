import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from '../User/user.entity';

@Table
export class Post extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id:string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title:string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    content:string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    userId:string;

    @BelongsTo(() => User)
    user: User

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    views:number;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    likes:number;

    @Default("")
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    slug:string;

    @Default([])
    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false
    })
    comments:string[];

    @Default([])
    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false
    })
    categorys:string[];

    @Default([])
    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false
    })
    tags:string[];

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    updatedAt: Date;
}